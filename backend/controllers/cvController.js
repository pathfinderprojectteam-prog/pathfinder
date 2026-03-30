const Profile = require('../models/Profile');
const CV = require('../models/CV');
const { generateCV: generateCVSchema } = require('../services/cvGeneratorService');

// @desc    Generate a new CV for the authenticated user based on their profile
// @route   POST /api/cv/generate
// @access  Private
const generateCV = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please complete your profile to generate a CV.' });
    }

    const compiledCvContent = generateCVSchema(profile);

    const newCv = await CV.create({
      user: req.user.id,
      content: compiledCvContent,
    });

    res.status(201).json(newCv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all generated CVs for the authenticated user
// @route   GET /api/cv
// @access  Private
const getUserCVs = async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(cvs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing CV's content
// @route   PUT /api/cv/:cvId
// @access  Private
const updateCV = async (req, res) => {
  try {
    const { cvId } = req.params;
    const { content } = req.body;

    const cv = await CV.findById(cvId);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found.' });
    }

    // Ensure the CV belongs to the authenticated user
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this CV.' });
    }

    if (!cv.isEditable) {
      return res.status(400).json({ message: 'This CV is no longer editable.' });
    }

    cv.content = content || cv.content;
    await cv.save();

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateCV,
  getUserCVs,
  updateCV,
};
