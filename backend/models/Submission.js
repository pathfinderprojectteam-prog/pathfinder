const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    freelanceProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FreelanceProject',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'accepted', 'rejected'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate submissions
submissionSchema.index({ student: 1, freelanceProject: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
