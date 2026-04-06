const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new conversation
// @route   POST /api/messaging/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required.' });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({ message: 'You cannot start a conversation with yourself.' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    // Check if conversation already exists between these two participants
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    conversation = await Conversation.create({
      participants: [req.user.id, recipientId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for the authenticated user
// @route   GET /api/messaging/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name email avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messaging/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'Conversation ID and content are required.' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    // Ensure the sender is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a participant in this conversation.' });
    }

    let message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      content,
    });
    
    // Populate sender details for real-time delivery
    message = await message.populate('sender', 'name email avatar');

    // Update last message in conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    // Broadcast message via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(conversationId).emit('receive_message', message);
    }

    // Notify the recipient (could also bypass if they are currently online in the room, but keep for offline)
    const recipient = conversation.participants.find(p => p.toString() !== req.user.id);
    if (recipient) {
      await Notification.create({
        recipient,
        type: 'message',
        message: `You have a new message from ${req.user.name}`,
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages in a conversation
// @route   GET /api/messaging/conversations/:conversationId/messages
// @access  Private
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    // Ensure the user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a participant in this conversation.' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages in a conversation as read
// @route   PUT /api/messaging/conversations/:conversationId/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    // Find all unread messages in this conversation sent by OTHERS
    const unreadMessages = await Message.find({
      conversation: conversationId,
      sender: { $ne: req.user.id },
      read: false
    });

    if (unreadMessages.length === 0) {
      return res.status(200).json({ message: 'No unread messages.' });
    }

    const unreadIds = unreadMessages.map(m => m._id);

    // Update them to read
    await Message.updateMany(
      { _id: { $in: unreadIds } },
      { $set: { read: true } }
    );

    // Broadcast read receipt via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(conversationId).emit('messages_read', {
        conversationId,
        userId: req.user.id,
        messageIds: unreadIds
      });
    }

    res.status(200).json({ message: 'Messages marked as read.', updatedCount: unreadIds.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
};
