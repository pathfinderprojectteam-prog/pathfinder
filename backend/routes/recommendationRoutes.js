const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships,
  getCareerPath,
} = require('../controllers/recommendationController');

// All recommendation routes are protected (must be Student)
router.use(protect);

// Recommender System Routes (powered by Gorse / Dynamic Fallback)
router.get('/jobs', getRecommendedJobs);
router.get('/freelance', getRecommendedFreelanceProjects);
router.get('/scholarships', getRecommendedScholarships);

// AI Career Path Suggestion (powered by OpenRouter)
router.get('/career-path', getCareerPath);

module.exports = router;
