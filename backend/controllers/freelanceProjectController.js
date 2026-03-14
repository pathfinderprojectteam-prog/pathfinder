const FreelanceProject = require('../models/FreelanceProject');

// @desc    Create a freelance project
// @route   POST /api/freelance-projects
// @access  Private (Client)
const createFreelanceProject = async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const project = await FreelanceProject.create({
      title,
      description,
      difficulty,
      client: req.user.id,
      validated: false,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all validated freelance projects
// @route   GET /api/freelance-projects
// @access  Public
const getAllFreelanceProjects = async (req, res) => {
  try {
    const projects = await FreelanceProject.find({ validated: true })
      .populate('client', 'name email organizationName')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single freelance project by ID
// @route   GET /api/freelance-projects/:id
// @access  Public
const getFreelanceProjectById = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id).populate(
      'client',
      'name email organizationName'
    );

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Freelance project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a freelance project
// @route   PUT /api/freelance-projects/:id
// @access  Private (Client - owner only)
const updateFreelanceProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Freelance project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this freelance project' });
    }

    const { title, description, difficulty } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.difficulty = difficulty || project.difficulty;

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a freelance project
// @route   DELETE /api/freelance-projects/:id
// @access  Private (Client - owner only)
const deleteFreelanceProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Freelance project not found' });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this freelance project' });
    }

    await project.deleteOne();

    res.json({ message: 'Freelance project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFreelanceProject,
  getAllFreelanceProjects,
  getFreelanceProjectById,
  updateFreelanceProject,
  deleteFreelanceProject,
};
