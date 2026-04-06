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
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      city: String,
      country: String,
      address: String,
    },
    // --- Student Specific ---
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
    careerObjective: {
      targetJobTitle: String,
      preferredWorkType: String,
      desiredSalary: String,
      industries: [String],
    },
    cvFile: {
      type: String,
    },
    availability: {
      type: String,
    },
    
    // --- Company & Client Specific ---
    industry: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companySize: {
      type: String,
    },
    website: {
      type: String,
    },
    foundedDate: {
      type: Date,
    },
    
    // --- University Specific ---
    institutionType: {
      type: String,
      enum: ['Public', 'Private', 'Specialized'],
    },
    programs: [String],
    accreditation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
