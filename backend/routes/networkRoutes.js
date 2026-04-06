const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFeed,
  createPost,
  likePost,
  commentOnPost,
  followUser,
  unfollowUser,
  getNetworkStats,
  getFollowing,
} = require('../controllers/networkController');

// Feed
router.get('/feed', protect, getFeed);

// Posts
router.post('/posts', protect, createPost);
router.put('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comment', protect, commentOnPost);

// Follow system
router.post('/follow/:userId', protect, followUser);
router.delete('/follow/:userId', protect, unfollowUser);

// Stats
router.get('/stats', protect, getNetworkStats);
router.get('/following', protect, getFollowing);

module.exports = router;
