const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes are protected
router.use(protect);

// @desc    Get all notifications for the authenticated user
router.get('/', getUserNotifications);

// @desc    Mark all notifications as read
router.put('/read-all', markAllNotificationsAsRead);

// @desc    Mark a notification as read
router.put('/:notificationId/read', markNotificationAsRead);

module.exports = router;
