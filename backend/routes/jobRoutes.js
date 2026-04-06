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
router.post('/', protect, allowRoles('Company'), createJob);
router.put('/:id', protect, allowRoles('Company'), updateJob);
router.delete('/:id', protect, allowRoles('Company'), deleteJob);

module.exports = router;
