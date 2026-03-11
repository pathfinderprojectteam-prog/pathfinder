const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Define routes
router
  .route('/')
  .post(protect, allowRoles('student'), createProfile)
  .get(protect, allowRoles('student'), getProfile)
  .put(protect, allowRoles('student'), updateProfile)
  .delete(protect, allowRoles('student'), deleteProfile);

module.exports = router;
