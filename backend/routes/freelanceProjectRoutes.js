const express = require('express');
const router = express.Router();
const {
  createFreelanceProject,
  getAllFreelanceProjects,
  getFreelanceProjectById,
  updateFreelanceProject,
  deleteFreelanceProject,
} = require('../controllers/freelanceProjectController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllFreelanceProjects);
router.get('/:id', getFreelanceProjectById);

// Client-only routes
router.post('/', protect, allowRoles('client'), createFreelanceProject);
router.put('/:id', protect, allowRoles('client'), updateFreelanceProject);
router.delete('/:id', protect, allowRoles('client'), deleteFreelanceProject);

module.exports = router;
