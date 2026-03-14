const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getStudentApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Student routes
router.post('/:jobId', protect, allowRoles('student'), applyToJob);
router.get('/student', protect, allowRoles('student'), getStudentApplications);

// Company routes
router.get('/job/:jobId', protect, allowRoles('company'), getApplicationsForJob);
router.put('/:applicationId/status', protect, allowRoles('company'), updateApplicationStatus);

module.exports = router;
