const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    academicLevelRequired: {
      type: String,
      enum: ['High School', 'Bachelor', 'Master', 'PhD', 'All'],
      default: 'Bachelor',
      required: true,
    },
    // --- Eligibility Criteria ---
    minimumGPA: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    requiredFieldOfStudy: {
      type: String,
      default: 'Any',
    },
    minimumYearsOfStudy: {
      type: Number,
      min: 0,
      default: 0,
    },
    nationality: {
      type: String,
      default: 'Any',
    },
    // --- Opportunity Details ---
    amount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'validated', 'rejected', 'changes_requested'],
      default: 'pending',
    },
    feedbackMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

scholarshipSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'scholarship',
  justOne: false,
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = Scholarship;
