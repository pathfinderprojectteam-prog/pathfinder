const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Company-only routes
router.post('/', protect, allowRoles('company'), createJob);
router.put('/:id', protect, allowRoles('company'), updateJob);
router.delete('/:id', protect, allowRoles('company'), deleteJob);

module.exports = router;
