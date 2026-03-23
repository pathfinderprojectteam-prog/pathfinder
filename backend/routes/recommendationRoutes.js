const express = require('express');
const router = express.Router();
const {
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships,
  getCareerPath,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// All recommendation routes are protected and restricted to students
router.use(protect, allowRoles('student'));

// @desc    Get recommended jobs
// @route   GET /api/recommendations/jobs
router.get('/jobs', getRecommendedJobs);

// @desc    Get recommended freelance projects
// @route   GET /api/recommendations/freelance
router.get('/freelance', getRecommendedFreelanceProjects);

// @desc    Get recommended scholarships
// @route   GET /api/recommendations/scholarships
router.get('/scholarships', getRecommendedScholarships);

// @desc    Get suggested career path
// @route   GET /api/recommendations/career-path
router.get('/career-path', getCareerPath);

module.exports = router;
