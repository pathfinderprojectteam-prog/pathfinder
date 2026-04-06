const express = require('express');
const router = express.Router();
const {
  applyToOpportunity,
  getStudentApplications,
  getApplicationsForOpportunity,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Student routes
router.post('/:type/:id', protect, allowRoles('Student'), applyToOpportunity);
router.get('/me', protect, allowRoles('Student'), getStudentApplications);

// Multi-Role routes (Company, Client, University)
router.get('/:type/:id', protect, allowRoles('Company', 'Client', 'University'), getApplicationsForOpportunity);
router.put('/:id/status', protect, allowRoles('Company', 'Client', 'University'), updateApplicationStatus);

module.exports = router;
