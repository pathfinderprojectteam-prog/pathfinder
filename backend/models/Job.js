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
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    validated: {
      type: Boolean,
      default: false,
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
