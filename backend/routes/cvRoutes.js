const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { 
  getCV, 
  generateCV, 
  updateCV, 
  uploadCV, 
  downloadPDFCV, 
  downloadDOCXCV 
} = require('../controllers/cvController');

// Configure multer for temp file upload
const upload = multer({ dest: 'uploads/' });

// CV Payload Endpoints
router.get('/', protect, getCV);
router.post('/generate', protect, generateCV);
router.put('/', protect, updateCV);

// CV Upload to Resume Parser
router.post('/upload', protect, upload.single('cvFile'), uploadCV);

// ATS-Optimized CV Generation Downloads
router.get('/download/pdf', protect, downloadPDFCV);
router.get('/download/docx', protect, downloadDOCXCV);

module.exports = router;
