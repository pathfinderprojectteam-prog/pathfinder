const Profile = require('../models/Profile');
const {
  getRecommendedJobs: recommendJobs,
  getRecommendedFreelanceProjects: recommendFreelanceProjects,
  getRecommendedScholarships: recommendScholarships,
} = require('../services/recommendationService');
const { suggestCareerPath } = require('../services/careerPathService');

// Helper to fetch the authenticated student's profile
const getStudentProfile = async (userId, res) => {
  // Populate profile for scoring accuracy
  const profile = await Profile.findOne({ user: userId })
    .populate('educations')
    .populate('skills')
    .populate('experiences');

  if (!profile) {
    res.status(404).json({ message: 'Profile not found. Please complete your profile.' });
    return null;
  }
  return profile;
};

// @desc    Get recommended jobs for the authenticated student
// @route   GET /api/recommendations/jobs
// @access  Private (Student)
const getRecommendedJobs = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id, res);
    if (!profile) return; // Response sent in helper

    const recommendations = await recommendJobs(profile);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended freelance projects for the authenticated student
// @route   GET /api/recommendations/freelance-projects
// @access  Private (Student)
const getRecommendedFreelanceProjects = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id, res);
    if (!profile) return;

    const recommendations = await recommendFreelanceProjects(profile);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended scholarships for the authenticated student
// @route   GET /api/recommendations/scholarships
// @access  Private (Student)
const getRecommendedScholarships = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id, res);
    if (!profile) return;

    const recommendations = await recommendScholarships(profile);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get suggested career path for the authenticated student
// @route   GET /api/recommendations/career-path
// @access  Private (Student)
const getCareerPath = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id, res);
    if (!profile) return;

    const path = await suggestCareerPath(profile);
    res.json({ careerPath: path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships,
  getCareerPath,
};
