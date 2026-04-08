const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Client = require('../models/Client');
const University = require('../models/University');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// @desc    Get all users with search and filter
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users: users,
      totalUsers: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle user status (Active/Suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'Suspended' ? 'Active' : 'Suspended';
    await user.save();

    res.json({ message: `User ${user.status === 'Suspended' ? 'suspended' : 'activated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user and all related data
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role-specific cleanup
    if (user.role === 'Student') await Student.deleteOne({ user: userId });
    if (user.role === 'Company') {
      await Company.deleteOne({ user: userId });
      await Job.deleteMany({ company: userId });
    }
    if (user.role === 'Client') {
      await Client.deleteOne({ user: userId });
      await FreelanceProject.deleteMany({ client: userId });
    }
    if (user.role === 'University') {
      await University.deleteOne({ user: userId });
      await Scholarship.deleteMany({ university: userId });
    }

    // Common cleanup
    await Profile.deleteOne({ user: userId });
    await Application.deleteMany({ user: userId });
    await Notification.deleteMany({ recipient: userId });
    await Message.deleteMany({ sender: userId });
    await Conversation.deleteMany({ participants: userId });
    await Post.deleteMany({ author: userId });
    await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  deleteUser
};
