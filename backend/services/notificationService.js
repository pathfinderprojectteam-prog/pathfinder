const Notification = require('../models/Notification');

/**
 * @desc    Create a new notification
 * @param   {string} recipientId - ID of the user receiving the notification
 * @param   {string} type - Type of notification (message, application, submission, validation)
 * @param   {string} message - Notification content
 * @returns {Promise<Object>} The created notification document
 */
const createNotification = async (recipientId, type, message) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      message,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

module.exports = {
  createNotification,
};
