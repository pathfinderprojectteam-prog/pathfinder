const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    freelanceProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FreelanceProject',
    },
    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
    },
    type: {
      type: String,
      enum: ['job', 'freelance', 'scholarship'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// We want to ensure a student can't apply twice to the same job, project, or scholarship
// But they can have multiple applications for different jobs.

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
