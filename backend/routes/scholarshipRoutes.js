const express = require('express');
const router = express.Router();
const {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
} = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllScholarships);
router.get('/:id', getScholarshipById);

// University-only routes
router.post('/', protect, allowRoles('university'), createScholarship);
router.put('/:id', protect, allowRoles('university'), updateScholarship);
router.delete('/:id', protect, allowRoles('university'), deleteScholarship);

module.exports = router;
