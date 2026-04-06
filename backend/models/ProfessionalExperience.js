const mongoose = require('mongoose');

const professionalExperienceSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProfessionalExperience = mongoose.model(
  'ProfessionalExperience',
  professionalExperienceSchema
);

module.exports = ProfessionalExperience;
