const express = require('express');
const router = express.Router();
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
} = require('../controllers/messagingController');
const { protect } = require('../middleware/authMiddleware');

// All messaging routes are protected
router.use(protect);

// Conversation routes
router.post('/conversations', createConversation);
router.get('/conversations', getUserConversations);
router.put('/conversations/:conversationId/read', markMessagesAsRead);

// Message routes
router.post('/messages', sendMessage);
router.get('/messages/:conversationId', getConversationMessages);

module.exports = router;
