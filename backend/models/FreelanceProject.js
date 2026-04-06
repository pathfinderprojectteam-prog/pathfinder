const mongoose = require('mongoose');

const freelanceProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
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
freelanceProjectSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'freelanceProject',
  justOne: false,
});

const FreelanceProject = mongoose.model('FreelanceProject', freelanceProjectSchema);

module.exports = FreelanceProject;
