const Application = require('../models/Application');
const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');
const Notification = require('../models/Notification');
const Profile = require('../models/Profile');

// @desc    Apply to a job, project or scholarship
// @route   POST /api/applications/:type/:id
// @access  Private (Student)
const applyToOpportunity = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['job', 'freelance', 'scholarship'].includes(type)) {
      return res.status(400).json({ message: 'Invalid application type' });
    }

    let opportunity;
    let ownerField;
    let modelField;

    if (type === 'job') {
      opportunity = await Job.findById(id);
      ownerField = 'company';
      modelField = 'job';
    } else if (type === 'freelance') {
      opportunity = await FreelanceProject.findById(id);
      ownerField = 'client';
      modelField = 'freelanceProject';
    } else if (type === 'scholarship') {
      opportunity = await Scholarship.findById(id);
      ownerField = 'university';
      modelField = 'scholarship';
    }

    if (!opportunity) {
      return res.status(404).json({ message: `${type} not found` });
    }

    if (opportunity.status !== 'validated') {
      return res.status(400).json({ message: `This ${type} is not yet approved and not available for applications` });
    }

    // Check for duplicate application
    const query = { student: req.user.id, type };
    query[modelField] = id;
    const alreadyApplied = await Application.findOne(query);

    if (alreadyApplied) {
      return res.status(400).json({ message: `You have already applied to this ${type}` });
    }

    // --- Scholarship Eligibility Check ---
    if (type === 'scholarship') {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ message: 'You must complete your profile before applying to scholarships' });
      }

      // GPA Check
      if (opportunity.minimumGPA && opportunity.minimumGPA > 0) {
        if (!profile.gpa && profile.gpa !== 0) {
          return res.status(400).json({ message: `This scholarship requires a minimum GPA of ${opportunity.minimumGPA}. Please add your GPA to your profile first.` });
        }
        if (profile.gpa < opportunity.minimumGPA) {
          return res.status(400).json({ message: `Minimum GPA of ${opportunity.minimumGPA} required (your GPA: ${profile.gpa})` });
        }
      }

      // Field of Study Check
      if (opportunity.requiredFieldOfStudy && opportunity.requiredFieldOfStudy !== 'Any') {
        if (!profile.fieldOfStudy) {
          return res.status(400).json({ message: `This scholarship requires a ${opportunity.requiredFieldOfStudy} degree. Please add your field of study to your profile.` });
        }
        const reqField = opportunity.requiredFieldOfStudy.toLowerCase();
        const studentField = profile.fieldOfStudy.toLowerCase();
        if (!studentField.includes(reqField) && !reqField.includes(studentField)) {
          return res.status(400).json({ message: `This scholarship requires a ${opportunity.requiredFieldOfStudy} degree (your field: ${profile.fieldOfStudy})` });
        }
      }

      // Degree Level Check
      if (opportunity.academicLevelRequired && opportunity.academicLevelRequired !== 'All') {
        if (profile.degreeLevel && profile.degreeLevel !== opportunity.academicLevelRequired) {
          return res.status(400).json({ message: `This scholarship is for ${opportunity.academicLevelRequired} students (your level: ${profile.degreeLevel})` });
        }
      }

      // Years of Study Check
      if (opportunity.minimumYearsOfStudy && opportunity.minimumYearsOfStudy > 0) {
        if (!profile.yearsOfStudy && profile.yearsOfStudy !== 0) {
          return res.status(400).json({ message: `This scholarship requires at least ${opportunity.minimumYearsOfStudy} years of study completed. Please update your profile.` });
        }
        if (profile.yearsOfStudy < opportunity.minimumYearsOfStudy) {
          return res.status(400).json({ message: `Minimum ${opportunity.minimumYearsOfStudy} years of study required (you have: ${profile.yearsOfStudy})` });
        }
      }
    }

    const applicationData = {
      student: req.user.id,
      type,
    };
    applicationData[modelField] = id;

    const application = await Application.create(applicationData);

    // Notify the owner
    await Notification.create({
      recipient: opportunity[ownerField],
      type: 'application',
      message: `A new student has applied to your ${type}: ${opportunity.title}`,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a specific opportunity
// @route   GET /api/applications/:type/:id
// @access  Private (Owner)
const getApplicationsForOpportunity = async (req, res) => {
  try {
    const { type, id } = req.params;
    let opportunity;
    let ownerField;
    let modelField;

    if (type === 'job') {
      opportunity = await Job.findById(id);
      ownerField = 'company';
      modelField = 'job';
    } else if (type === 'freelance') {
      opportunity = await FreelanceProject.findById(id);
      ownerField = 'client';
      modelField = 'freelanceProject';
    } else if (type === 'scholarship') {
      opportunity = await Scholarship.findById(id);
      ownerField = 'university';
      modelField = 'scholarship';
    }

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Ensure the owner owns this opportunity
    if (opportunity[ownerField].toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applications for this opportunity' });
    }

    const query = {};
    query[modelField] = id;
    const applications = await Application.find(query)
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
      .populate('job', 'title company')
      .populate('freelanceProject', 'title client')
      .populate('scholarship', 'title university')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Owner)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be either "accepted" or "rejected"' });
    }

    const application = await Application.findById(req.params.id)
        .populate('job')
        .populate('freelanceProject')
        .populate('scholarship');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    let opportunity = application.job || application.freelanceProject || application.scholarship;
    let ownerField = application.type === 'job' ? 'company' : (application.type === 'freelance' ? 'client' : 'university');

    // Ensure the owner owns the related opportunity
    if (opportunity[ownerField].toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    const updatedApplication = await application.save();

    // Notify the student
    await Notification.create({
      recipient: application.student,
      type: 'validation',
      message: `Your application status for "${opportunity.title}" has been updated to: ${status}`,
    });

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToOpportunity,
  getApplicationsForOpportunity,
  getStudentApplications,
  updateApplicationStatus,
};
