const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {
  validateJob,
  rejectJob,
  validateFreelanceProject,
  rejectFreelanceProject,
  validateScholarship,
  rejectScholarship,
  requestChanges,
  getPendingItems,
  getAdminStats,
  getRecentActivity,
  getSystemHealth,
} = require('../controllers/adminValidationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Admin-only GET routes
router.get('/pending', protect, allowRoles('Admin'), getPendingItems);
router.get('/stats', protect, allowRoles('Admin'), getAdminStats);
router.get('/recent-activity', protect, allowRoles('Admin'), getRecentActivity);
router.get('/system-health', protect, allowRoles('Admin'), getSystemHealth);

// Admin-only validation & rejection routes
router.post('/request-changes/:type/:id', protect, allowRoles('Admin'), requestChanges);
router.put('/validate/job/:id', protect, allowRoles('Admin'), validateJob);
router.put('/reject/job/:id', protect, allowRoles('Admin'), rejectJob);

router.put('/validate/freelance-project/:id', protect, allowRoles('Admin'), validateFreelanceProject);
router.put('/reject/freelance-project/:id', protect, allowRoles('Admin'), rejectFreelanceProject);

router.put('/validate/scholarship/:id', protect, allowRoles('Admin'), validateScholarship);
router.put('/reject/scholarship/:id', protect, allowRoles('Admin'), rejectScholarship);

// Admin-only user management routes
router.get('/users', protect, allowRoles('Admin'), adminController.getAllUsers);
router.put('/users/:id/status', protect, allowRoles('Admin'), adminController.toggleUserStatus);
router.delete('/users/:id', protect, allowRoles('Admin'), adminController.deleteUser);

module.exports = router;
