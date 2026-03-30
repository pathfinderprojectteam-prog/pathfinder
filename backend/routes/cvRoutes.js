const express = require('express');
const router = express.Router();
const {
  generateCV,
  getUserCVs,
  updateCV,
} = require('../controllers/cvController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// All CV routes are protected and restricted to students
router.use(protect, allowRoles('student'));

// @desc    Generate a CV from user's profile
// @route   POST /api/cv/generate
router.post('/generate', generateCV);

// @desc    Get all active CVs for the user
// @route   GET /api/cv
router.get('/', getUserCVs);

// @desc    Update CV content
// @route   PUT /api/cv/:cvId
router.put('/:cvId', updateCV);

module.exports = router;
