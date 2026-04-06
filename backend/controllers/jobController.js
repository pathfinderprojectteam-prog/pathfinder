const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Company)
const createJob = async (req, res) => {
  try {
    const { title, description, requiredExperience } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    if (req.user.role !== 'Company') {
      return res.status(403).json({ message: 'Only companies can post jobs.' });
    }

    const job = await Job.create({
      title,
      description,
      requiredExperience,
      company: req.user.id,
      status: 'pending',
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all validated jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'validated' })
      .populate('company', 'name email industry')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'company',
      'name email industry'
    );

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Company - owner only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, requiredExperience } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.requiredExperience =
      requiredExperience !== undefined ? requiredExperience : job.requiredExperience;

    // Reset status for re-validation and clear feedback
    job.status = 'pending';
    job.feedbackMessage = '';

    const updatedJob = await job.save();

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Company - owner only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
