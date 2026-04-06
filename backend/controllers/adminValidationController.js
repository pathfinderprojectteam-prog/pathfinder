const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');
const Company = require('../models/Company');
const Client = require('../models/Client');
const University = require('../models/University');
const Notification = require('../models/Notification');
const Student = require('../models/Student');
const User = require('../models/User');
const Application = require('../models/Application');
const { insertItemIntoGorse } = require('../services/recommendationService');

// @desc    Validate a job
// @route   PUT /api/admin/validate/job/:id
const validateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'validated';
    job.feedbackMessage = '';
    const updatedJob = await job.save();

    await Notification.create({
      recipient: job.company,
      type: 'validation',
      message: `Your job post "${job.title}" has been validated and is now live!`,
    });

    // Sync validated job to Gorse
    insertItemIntoGorse(updatedJob._id, 'job', { skills: updatedJob.requiredSkills || [] })
      .catch(err => console.warn('Gorse job sync failed:', err.message));

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a job
// @route   PUT /api/admin/reject/job/:id
const rejectJob = async (req, res) => {
  try {
    const { reason } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'rejected';
    job.feedbackMessage = reason || 'Does not meet current platform quality standards.';
    const updatedJob = await job.save();

    await Notification.create({
      recipient: job.company,
      type: 'validation',
      message: `Your job post "${job.title}" was rejected. Reason: ${job.feedbackMessage}`,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a freelance project
// @route   PUT /api/admin/validate/freelance-project/:id
const validateFreelanceProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Freelance project not found' });

    project.status = 'validated';
    project.feedbackMessage = '';
    const updatedProject = await project.save();

    await Notification.create({
      recipient: project.client,
      type: 'validation',
      message: `Your freelance project "${project.title}" has been validated and is now live!`,
    });

    // Sync validated freelance project to Gorse
    insertItemIntoGorse(updatedProject._id, 'freelance', { skills: updatedProject.requiredSkills || [] })
      .catch(err => console.warn('Gorse freelance sync failed:', err.message));

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a freelance project
// @route   PUT /api/admin/reject/freelance-project/:id
const rejectFreelanceProject = async (req, res) => {
  try {
    const { reason } = req.body;
    const project = await FreelanceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Freelance project not found' });

    project.status = 'rejected';
    project.feedbackMessage = reason || 'Insufficient project details provided.';
    const updatedProject = await project.save();

    await Notification.create({
      recipient: project.client,
      type: 'validation',
      message: `Your project "${project.title}" was rejected. Reason: ${project.feedbackMessage}`,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a scholarship
// @route   PUT /api/admin/validate/scholarship/:id
const validateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    scholarship.status = 'validated';
    scholarship.feedbackMessage = '';
    const updatedScholarship = await scholarship.save();

    await Notification.create({
      recipient: scholarship.university,
      type: 'validation',
      message: `Your scholarship post "${scholarship.title}" has been validated and is now live!`,
    });

    // Sync validated scholarship to Gorse
    insertItemIntoGorse(updatedScholarship._id, 'scholarship', { skills: updatedScholarship.requiredSkills || [] })
      .catch(err => console.warn('Gorse scholarship sync failed:', err.message));

    res.json(updatedScholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a scholarship
// @route   PUT /api/admin/reject/scholarship/:id
const rejectScholarship = async (req, res) => {
  try {
    const { reason } = req.body;
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    scholarship.status = 'rejected';
    scholarship.feedbackMessage = reason || 'Official documentation link required.';
    const updatedScholarship = await scholarship.save();

    await Notification.create({
      recipient: scholarship.university,
      type: 'validation',
      message: `Your scholarship "${scholarship.title}" was rejected. Reason: ${scholarship.feedbackMessage}`,
    });

    res.json(updatedScholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request changes for an opportunity
// @route   POST /api/admin/request-changes/:type/:id
const requestChanges = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { feedback } = req.body;
    
    let item;
    let recipient;
    
    if (type === 'job') {
      item = await Job.findById(id);
      recipient = item.company;
    } else if (type === 'freelance-project') {
      item = await FreelanceProject.findById(id);
      recipient = item.client;
    } else if (type === 'scholarship') {
      item = await Scholarship.findById(id);
      recipient = item.university;
    }

    if (!item) return res.status(404).json({ message: `${type} not found` });

    item.status = 'changes_requested';
    item.feedbackMessage = feedback || 'Please review the details and resubmit.';
    await item.save();

    await Notification.create({
      recipient,
      type: 'validation',
      message: `Admin has requested changes for your ${type} "${item.title}". Feedback: ${item.feedbackMessage}`,
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active moderation items (pending + changes requested)
const getPendingItems = async (req, res) => {
  try {
    const filter = { status: { $in: ['pending', 'changes_requested'] } };
    const [jobs, freelance, scholarships] = await Promise.all([
      Job.find(filter).populate('company', 'name email').sort({ updatedAt: -1 }),
      FreelanceProject.find(filter).populate('client', 'name email').sort({ updatedAt: -1 }),
      Scholarship.find(filter).populate('university', 'name email').sort({ updatedAt: -1 }),
    ]);

    res.json({ jobs, freelance, scholarships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [
      studentCount, companyCount, clientCount, universityCount,
      jobCount, projectCount, scholarshipCount, applicationCount,
      pendingJobs, pendingFreelance, pendingScholarships
    ] = await Promise.all([
      Student.countDocuments(),
      Company.countDocuments(),
      Client.countDocuments(),
      University.countDocuments(),
      Job.countDocuments(),
      FreelanceProject.countDocuments(),
      Scholarship.countDocuments(),
      Application.countDocuments(),
      Job.find({ status: 'pending' }).countDocuments(),
      FreelanceProject.find({ status: 'pending' }).countDocuments(),
      Scholarship.find({ status: 'pending' }).countDocuments(),
    ]);

    res.json({
      totalStudents: studentCount,
      totalCompanies: companyCount,
      totalClients: clientCount,
      totalUniversities: universityCount,
      totalJobs: jobCount,
      totalFreelance: projectCount,
      totalScholarships: scholarshipCount,
      totalApplications: applicationCount,
      pendingJobs,
      pendingFreelance,
      pendingScholarships,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent platform activity
// @route   GET /api/admin/recent-activity
const getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentJobs, recentApplications] = await Promise.all([
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5),
      Job.find().select('title createdAt').sort({ createdAt: -1 }).limit(5),
      Application.find().select('type status createdAt')
        .populate('student', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({ recentUsers, recentJobs, recentApplications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system health status
// @route   GET /api/admin/system-health
const getSystemHealth = async (req, res) => {
  const axios = require('axios');

  // Check MongoDB by seeing if we can reach the User model
  let mongoStatus = 'disconnected';
  try {
    await User.findOne().select('_id').lean();
    mongoStatus = 'connected';
  } catch {}

  // Check Gorse
  let gorseStatus = 'stopped';
  try {
    await axios.get('http://localhost:8088', { timeout: 2000 });
    gorseStatus = 'running';
  } catch {}

  // Check Resume Parser
  let parserStatus = 'stopped';
  try {
    await axios.get('http://localhost:5000', { timeout: 2000 });
    parserStatus = 'running';
  } catch {}

  res.json({
    backend: 'online',
    mongodb: mongoStatus,
    gorse: gorseStatus,
    resumeParser: parserStatus,
  });
};

module.exports = {
  validateJob,
  rejectJob,
  validateFreelanceProject,
  rejectFreelanceProject,
  validateScholarship,
  rejectScholarship,
  requestChanges,
  getPendingItems,
  getAdminStats,
  getRecentActivity,
  getSystemHealth,
};
