const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    availability: {
      type: String,
    },
    avatar: {
      type: String,
    },
    cvFile: {
      type: String,
    },
    educations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Education',
      },
    ],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    experiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfessionalExperience',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
