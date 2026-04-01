import api from './api';

export const dataService = {
  // --- Profile & Dashboard ---
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data) => api.put('/api/profile', data),
  getCareerPath: () => api.get('/api/recommendations/career-path'),
  getRecommendedJobs: () => api.get('/api/recommendations/jobs'),

  // --- Opportunities ---
  getJobs: () => api.get('/api/jobs'),
  getFreelance: () => api.get('/api/freelance-projects'),
  getScholarships: () => api.get('/api/scholarships'),
  
  // --- Applications ---
  getUserApplications: () => api.get('/api/applications/student'),
  applyToJob: (jobId) => api.post(`/api/applications/${jobId}`),

  // --- Messaging ---
  getConversations: () => api.get('/api/conversations'),
  getMessages: (conversationId) => api.get(`/api/messages/${conversationId}`),
  sendMessage: (conversationId, content) => api.post('/api/messages', { conversationId, content }),

  // --- Notifications ---
  getNotifications: () => api.get('/api/notifications'),
  markNotificationAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),

  // --- Advanced AI Recommendations ---
  getRecommendedFreelance: () => api.get('/api/recommendations/freelance'),
  getRecommendedScholarships: () => api.get('/api/recommendations/scholarships'),

  // --- CV Engine ---
  getCV: () => api.get('/api/cv'),
  generateCV: () => api.post('/api/cv/generate'),
  updateCV: (content) => api.put('/api/cv', { content }),

  // --- Company: Job Management ---
  createJob: (data) => api.post('/api/jobs', data),
  getAllJobsRaw: () => api.get('/api/jobs'),

  // --- Client: Freelance Project Management ---
  createFreelanceProject: (data) => api.post('/api/freelance-projects', data),
  getAllFreelanceRaw: () => api.get('/api/freelance-projects'),

  // --- University: Scholarship Management ---
  createScholarship: (data) => api.post('/api/scholarships', data),
  getAllScholarshipsRaw: () => api.get('/api/scholarships'),

  // --- Company: Application Management ---
  getJobApplications: (jobId) => api.get(`/api/applications/job/${jobId}`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/api/applications/${applicationId}/status`, { status }),

  // --- Admin: Pending moderation queue ---
  getPendingItems: () => api.get('/api/admin/pending'),

  // --- Admin: Validation ---
  validateJob: (jobId) => api.put(`/api/admin/jobs/${jobId}/validate`),
  validateFreelanceProject: (projectId) =>
    api.put(`/api/admin/freelance-projects/${projectId}/validate`),
  validateScholarship: (scholarshipId) =>
    api.put(`/api/admin/scholarships/${scholarshipId}/validate`),
  // --- File Upload ---
  uploadFile: (formData) => api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};
