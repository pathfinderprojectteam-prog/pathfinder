const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const ProfessionalExperience = require('../models/ProfessionalExperience');
const Student = require('../models/Student');
const User = require('../models/User');
const { calculateProfileCompletion } = require('../services/profileCompletionService');

// @desc    Create a profile
const createProfile = async (req, res) => {
  try {
    const profileExists = await Profile.findOne({ user: req.user.id });
    if (profileExists) return res.status(400).json({ message: 'Profile already exists' });
    const profile = await Profile.create({ user: req.user.id, ...req.body });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id })
      .populate('user', 'name email role')
      .populate('educations')
      .populate('skills')
      .populate('experiences');

    if (!profile) {
      profile = await Profile.create({ user: req.user.id });
      profile = await Profile.findById(profile._id).populate('user', 'name email role');
    }

    let completion = 0;
    if (req.user.role === 'Student') {
      completion = calculateProfileCompletion(profile);
      await Student.findByIdAndUpdate(req.user.id, { profileCompletion: completion });
    }

    res.json({ ...profile.toObject(), profileCompletion: completion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
  try {
    const { 
      phone, location, bio, avatar, cvFile, careerObjective,
      industry, companyName, companySize, website, foundedDate, 
      institutionType, programs, accreditation,
      educations, skills, experiences
    } = req.body;
    
    // Find or create profile
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await Profile.create({ user: req.user.id });
    }

    // Update basic profile fields
    profile.phone = phone || profile.phone;
    profile.location = location || profile.location;
    profile.bio = bio || profile.bio;
    profile.avatar = avatar || profile.avatar;
    profile.cvFile = cvFile || profile.cvFile;
    profile.careerObjective = careerObjective || profile.careerObjective;

    // Update Company/Client specific fields
    profile.industry = industry || profile.industry;
    profile.companyName = companyName || profile.companyName;
    profile.companySize = companySize || profile.companySize;
    profile.website = website || profile.website;
    profile.foundedDate = foundedDate || profile.foundedDate;

    // Update University specific fields
    profile.institutionType = institutionType || profile.institutionType;
    profile.programs = programs || profile.programs;
    profile.accreditation = accreditation || profile.accreditation;

    // Handle nested collections: clear old and insert new
    if (educations) {
      await Education.deleteMany({ profile: profile._id });
      const edDocs = await Education.insertMany(
        educations.map(ed => ({ 
          ...ed, 
          profile: profile._id,
          yearOfGraduation: ed.yearOfGraduation === '' ? undefined : ed.yearOfGraduation
        }))
      );
      profile.educations = edDocs.map(d => d._id);
    }

    if (skills) {
      await Skill.deleteMany({ profile: profile._id });
      const skillDocs = await Skill.insertMany(
        skills.map(sk => ({ 
          ...sk, 
          profile: profile._id,
          yearsExperience: sk.yearsExperience === '' ? undefined : sk.yearsExperience
        }))
      );
      profile.skills = skillDocs.map(d => d._id);
    }

    if (experiences) {
      await ProfessionalExperience.deleteMany({ profile: profile._id });
      const expDocs = await ProfessionalExperience.insertMany(
        experiences.map(ex => ({ 
          ...ex, 
          profile: profile._id,
          startDate: ex.startDate === '' ? undefined : ex.startDate,
          endDate: ex.endDate === '' ? undefined : ex.endDate
        }))
      );
      profile.experiences = expDocs.map(d => d._id);
    }

    await profile.save();

    const updatedProfile = await Profile.findById(profile._id)
      .populate('user', 'name email role')
      .populate('educations')
      .populate('skills')
      .populate('experiences');

    // Sync completion score
    let completion = 0;
    if (req.user.role === 'Student') {
      completion = calculateProfileCompletion(updatedProfile);
      await Student.findByIdAndUpdate(req.user.id, { profileCompletion: completion });
    }

    res.json({ ...updatedProfile.toObject(), profileCompletion: completion });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      await profile.deleteOne();
      res.json({ message: 'Profile removed' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChosenPath = async (req, res) => {
  try {
    const { path } = req.body;
    if (!['employment', 'freelance', 'studies', 'hybrid'].includes(path)) {
      return res.status(400).json({ message: 'Invalid career path selection.' });
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { chosenPath: path },
      { new: true }
    );

    res.json({ message: `Career path set to ${path}`, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  updateChosenPath,
};