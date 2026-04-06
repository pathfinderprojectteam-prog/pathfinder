const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const Profile = require('../models/Profile');
const CV = require('../models/CV');
const { generatePDF, generateDOCX, generateAISummary } = require('../services/cvGeneratorService');

const RESUME_PARSER_URL = process.env.RESUME_PARSER_URL || 'http://127.0.0.1:5000/processapi';

/**
 * @desc    Get current user's CV data
 * @route   GET /api/cv
 * @access  Private
 */
const getCV = async (req, res) => {
  try {
    let cv = await CV.findOne({ user: req.user.id });
    if (!cv) {
      // Create empty CV object if none exists
      cv = await CV.create({ user: req.user.id, content: {} });
    }
    res.json(cv);
  } catch (error) {
    console.error('getCV Error:', error.message);
    res.status(500).json({ message: 'Error retrieving CV' });
  }
};

/**
 * @desc    Generate CV payload from profile
 * @route   POST /api/cv/generate
 * @access  Private
 */
const generateCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user')
      .populate('skills')
      .populate('experiences')
      .populate('educations');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Cannot generate CV.' });
    }

    const summaryText = await generateAISummary(profile, profile.careerObjective || 'Job');

    const generatedContent = {
      personalInfo: {
        name: profile.user?.name || '',
        email: profile.user?.email || '',
      },
      summary: summaryText,
      skills: (profile.skills || []).map(s => s.name),
      experience: (profile.experiences || []).map(exp => ({
        title: exp.title,
        company: exp.company,
        duration: exp.years ? `${exp.years} years` : 'Past',
        description: exp.description || ''
      })),
      education: (profile.educations || []).map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
      }))
    };

    let cv = await CV.findOne({ user: req.user.id });
    if (cv) {
      cv.content = generatedContent;
      await cv.save();
    } else {
      cv = await CV.create({ user: req.user.id, content: generatedContent });
    }

    res.json(cv);
  } catch (error) {
    console.error('generateCV Error:', error.message);
    res.status(500).json({ message: 'Failed to auto-generate CV from profile.' });
  }
};

/**
 * @desc    Update CV content (editor save)
 * @route   PUT /api/cv
 * @access  Private
 */
const updateCV = async (req, res) => {
  try {
    const { content } = req.body;
    let cv = await CV.findOne({ user: req.user.id });
    if (!cv) {
      cv = await CV.create({ user: req.user.id, content });
    } else {
      cv.content = typeof content === 'string' ? JSON.parse(content) : content;
      await cv.save();
    }
    res.json(cv);
  } catch (error) {
    console.error('updateCV Error:', error.message);
    res.status(500).json({ message: 'Failed to update CV content.' });
  }
};

/**
 * @desc    Upload CV to Resume Parser API and auto-fill profile
 * @route   POST /api/cv/upload
 * @access  Private
 */
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Prepare form data to send to Python/Resume Parser API
    const formData = new FormData();
    const filePath = path.join(__dirname, '../', req.file.path);
    formData.append('resume', fs.createReadStream(filePath));

    // 2. Call external parser
    const response = await axios.post(RESUME_PARSER_URL, formData, {
      headers: { ...formData.getHeaders() }
    });

    const parsedData = response.data;

    // Clean up local temp uploaded file
    fs.unlinkSync(filePath);

    res.json({ 
      message: 'CV Parsed successfully', 
      parsedData
    });
  } catch (error) {
    console.error('CV Upload Error:', error.message);
    res.status(500).json({ message: 'Resume Parser Failed. Ensure the Flask API is running on port 5000.' });
  }
};

/**
 * @desc    Download generated PDF CV
 * @route   GET /api/cv/download/pdf
 * @access  Private
 */
const downloadPDFCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user')
      .populate('skills')
      .populate('experiences')
      .populate('educations');

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const buffer = await generatePDF(profile, profile.careerObjective || 'Job');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(buffer);
  } catch (error) {
    console.error('PDF Generation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Download generated DOCX CV
 * @route   GET /api/cv/download/docx
 * @access  Private
 */
const downloadDOCXCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user')
      .populate('skills')
      .populate('experiences')
      .populate('educations');

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const buffer = await generateDOCX(profile, profile.careerObjective || 'Job');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.docx"');
    res.send(buffer);
  } catch (error) {
    console.error('DOCX Generation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCV,
  generateCV,
  updateCV,
  uploadCV,
  downloadPDFCV,
  downloadDOCXCV
};
