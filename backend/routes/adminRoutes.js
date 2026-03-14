const express = require('express');
const router = express.Router();
const {
  validateJob,
  validateFreelanceProject,
  validateScholarship,
} = require('../controllers/adminValidationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Admin-only validation routes
router.put('/jobs/:jobId/validate', protect, allowRoles('admin'), validateJob);
router.put(
  '/freelance-projects/:projectId/validate',
  protect,
  allowRoles('admin'),
  validateFreelanceProject
);
router.put(
  '/scholarships/:scholarshipId/validate',
  protect,
  allowRoles('admin'),
  validateScholarship
);

module.exports = router;
