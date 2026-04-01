const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');

// @desc    Validate a job
// @route   PUT /api/admin/validate/job/:id
// @access  Private (Admin)
const validateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.validated = true;
    const updatedJob = await job.save();

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a freelance project
// @route   PUT /api/admin/validate/freelance-project/:id
// @access  Private (Admin)
const validateFreelanceProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Freelance project not found' });
    }

    project.validated = true;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a scholarship
// @route   PUT /api/admin/validate/scholarship/:id
// @access  Private (Admin)
const validateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.scholarshipId);

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    scholarship.validated = true;
    const updatedScholarship = await scholarship.save();

    res.json(updatedScholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unvalidated items across all opportunity types
// @route   GET /api/admin/pending
// @access  Private (Admin)
const getPendingItems = async (req, res) => {
  try {
    const [jobs, freelanceProjects, scholarships] = await Promise.all([
      Job.find({ validated: false }).populate('company', 'name email').sort({ createdAt: -1 }),
      FreelanceProject.find({ validated: false }).populate('client', 'name email').sort({ createdAt: -1 }),
      Scholarship.find({ validated: false }).populate('university', 'name email').sort({ createdAt: -1 }),
    ]);

    res.json({ jobs, freelanceProjects, scholarships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateJob,
  validateFreelanceProject,
  validateScholarship,
  getPendingItems,
};
