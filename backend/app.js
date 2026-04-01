const express = require('express');
const path = require('path');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/freelance-projects', require('./routes/freelanceProjectRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/conversations', require('./routes/messagingRoutes'));
app.use('/api/messages', require('./routes/messagingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/cv', require('./routes/cvRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));



app.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "PathFinder API running"
  });
});

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;