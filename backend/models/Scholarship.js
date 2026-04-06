const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    academicLevelRequired: {
      type: String,
      required: true,
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

// Reverse populate with virtuals
scholarshipSchema.virtual('applications', {
  ref: 'ScholarshipApplication',
  localField: '_id',
  foreignField: 'scholarship',
  justOne: false,
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = Scholarship;
