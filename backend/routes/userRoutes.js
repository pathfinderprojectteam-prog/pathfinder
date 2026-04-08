const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Search users for messaging (excludes current user and admins)
// @route   GET /api/users/search?q=query
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    const query = {
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        { role: { $ne: 'Admin' } },     // Exclude admins
      ]
    };

    if (q) {
      query.$and.push({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      });
    }

    const users = await User.find(query)
      .select('name email avatar role')
      .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
