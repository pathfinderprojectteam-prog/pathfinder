const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredExperience: {
      type: Number,
      default: 0,
    },
    requiredDegreeLevel: {
      type: String,
      enum: ['Any', 'High School', 'Bachelor', 'Master', 'PhD'],
      default: 'Any',
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
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
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  justOne: false,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
