const Post = require('../models/Post');
const Follow = require('../models/Follow');
const User = require('../models/User');

// @desc    Get feed posts (posts from followed users + own)
// @route   GET /api/network/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    const followings = await Follow.find({ follower: req.user.id }).select('following');
    const followingIds = followings.map(f => f.following);
    followingIds.push(req.user.id); // Include own posts

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'name email role')
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/network/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required.' });

    const post = await Post.create({
      author: req.user.id,
      content,
      tags: tags || [],
    });

    const populated = await post.populate('author', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a post (toggle)
// @route   PUT /api/network/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const already = post.likes.includes(req.user.id);
    if (already) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !already });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/network/posts/:id/comment
// @access  Private
const commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content is required.' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    post.comments.push({ author: req.user.id, content });
    await post.save();
    await post.populate('comments.author', 'name');
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow a user
// @route   POST /api/network/follow/:userId
// @access  Private
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ message: 'User not found.' });

    const existing = await Follow.findOne({ follower: req.user.id, following: userId });
    if (existing) return res.status(400).json({ message: 'Already following this user.' });

    await Follow.create({ follower: req.user.id, following: userId });
    res.status(201).json({ message: `Now following ${target.name}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/network/follow/:userId
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Follow.findOneAndDelete({ follower: req.user.id, following: userId });
    if (!result) return res.status(404).json({ message: 'You are not following this user.' });

    res.json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get followers + following counts for current user
// @route   GET /api/network/stats
// @access  Private
const getNetworkStats = async (req, res) => {
  try {
    const [followers, following] = await Promise.all([
      Follow.countDocuments({ following: req.user.id }),
      Follow.countDocuments({ follower: req.user.id }),
    ]);
    res.json({ followers, following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of user IDs the current user is following
// @route   GET /api/network/following
// @access  Private
const getFollowing = async (req, res) => {
  try {
    const list = await Follow.find({ follower: req.user.id }).populate('following', 'name email role');
    res.json(list.map(f => f.following));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeed,
  createPost,
  likePost,
  commentOnPost,
  followUser,
  unfollowUser,
  getNetworkStats,
  getFollowing,
};
