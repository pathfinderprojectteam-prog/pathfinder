const Scholarship = require('../models/Scholarship');

// @desc    Create a scholarship
// @route   POST /api/scholarships
// @access  Private (University)
const createScholarship = async (req, res) => {
  try {
    const { title, academicLevelRequired, deadline } = req.body;

    if (!title || !academicLevelRequired || !deadline) {
      return res
        .status(400)
        .json({ message: 'Please provide title, academicLevelRequired and deadline' });
    }

    const scholarship = await Scholarship.create({
      title,
      academicLevelRequired,
      deadline,
      university: req.user.id,
      validated: false,
    });

    res.status(201).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all validated scholarships
// @route   GET /api/scholarships
// @access  Public
const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ validated: true })
      .populate('university', 'name email accreditation country')
      .sort({ createdAt: -1 });

    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate(
      'university',
      'name email accreditation country'
    );

    if (scholarship) {
      res.json(scholarship);
    } else {
      res.status(404).json({ message: 'Scholarship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private (University - owner only)
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    // Check ownership
    if (scholarship.university.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this scholarship' });
    }

    const { title, academicLevelRequired, deadline } = req.body;

    scholarship.title = title || scholarship.title;
    scholarship.academicLevelRequired =
      academicLevelRequired || scholarship.academicLevelRequired;
    scholarship.deadline = deadline || scholarship.deadline;

    const updatedScholarship = await scholarship.save();

    res.json(updatedScholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private (University - owner only)
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    // Check ownership
    if (scholarship.university.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this scholarship' });
    }

    await scholarship.deleteOne();

    res.json({ message: 'Scholarship removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
};
