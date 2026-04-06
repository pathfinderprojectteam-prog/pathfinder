const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  updateChosenPath,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProfile);
router.post('/', protect, createProfile);
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);
router.put('/chosen-path', protect, updateChosenPath);

module.exports = router;
