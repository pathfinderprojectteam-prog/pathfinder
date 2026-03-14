const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Student)
const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId;

    if (!jobId) {
      return res.status(400).json({ message: 'Please provide jobId' });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.validated) {
      return res.status(400).json({ message: 'This job is not available for applications' });
    }

    // Check for duplicate application (compound index will also enforce this)
    const alreadyApplied = await Application.findOne({
      student: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Company)
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the company owns this job
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email profileCompletion')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for the authenticated student
// @route   GET /api/applications/me
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title description company')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be either "accepted" or "rejected"' });
    }

    const application = await Application.findById(req.params.applicationId).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure the company owns the related job
    if (application.job.company.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getApplicationsForJob,
  getStudentApplications,
  updateApplicationStatus,
};
