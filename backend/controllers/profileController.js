const Profile = require('../models/Profile');
const Student = require('../models/Student');
const { calculateProfileCompletion } = require('../services/profileCompletionService');

// @desc    Create a profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const { bio, availability } = req.body;

    const profileExists = await Profile.findOne({ user: req.user.id });

    if (profileExists) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    const profile = await Profile.create({
      user: req.user.id,
      bio,
      availability,
    });

    if (req.user.role === 'student') {
        // Update student profile Completion
        const completion = calculateProfileCompletion(profile);
        await Student.findByIdAndUpdate(req.user.id, {
            profile: profile._id,
            profileCompletion: completion
        });
    }

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/profiles
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('educations')
      .populate('skills')
      .populate('experiences');

    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profiles
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { bio, availability } = req.body;

    const profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile.bio = bio || profile.bio;
      profile.availability = availability || profile.availability;

      const updatedProfile = await profile.save();

      // Recalculate completion for students
      if (req.user.role === 'student') {
        // We need to fetch the populated profile to accurately calculate completion
        const populatedProfile = await Profile.findById(updatedProfile._id)
           .populate('educations')
           .populate('skills')
           .populate('experiences');

         const completion = calculateProfileCompletion(populatedProfile);
         await Student.findByIdAndUpdate(req.user.id, {
            profileCompletion: completion
         });
      }

      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/profiles
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      await profile.deleteOne();
      
      if (req.user.role === 'student') {
        await Student.findByIdAndUpdate(req.user.id, {
             profile: null,
             profileCompletion: 0
        });
      }

      res.json({ message: 'Profile removed' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};
