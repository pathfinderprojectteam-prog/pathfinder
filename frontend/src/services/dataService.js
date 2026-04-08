
import api from './api';


export const dataService = {
  // --- Profile & Dashboard ---
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data) => api.put('/api/profile', data),
  getCareerPath: () => api.get('/api/recommendations/career-path'),
  updateChosenPath: (path) => api.put('/api/profile/chosen-path', { path }),
  getRecommendedJobs: () => api.get('/api/recommendations/jobs'),

  // --- Opportunities ---
  getJobs: () => api.get('/api/jobs'),
  getFreelance: () => api.get('/api/freelance-projects'),
  getScholarships: () => api.get('/api/scholarships'),

  // --- Applications ---
  getUserApplications: () => api.get('/api/applications/me'),
  applyToJob: (jobId) => api.post(`/api/applications/job/${jobId}`),
  applyToFreelance: (projectId) => api.post(`/api/applications/freelance/${projectId}`),
  applyToScholarship: (scholarshipId) => api.post(`/api/applications/scholarship/${scholarshipId}`),

  // --- Messaging ---
  getConversations: () => api.get('/api/conversations'),
  getMessages: (conversationId) => api.get(`/api/messages/${conversationId}`),
  sendMessage: (conversationId, content) => api.post('/api/messages', { conversationId, content }),
  createConversation: (recipientId) => api.post('/api/conversations', { recipientId }),
  markConversationRead: (conversationId) => api.put(`/api/conversations/${conversationId}/read`),

  // --- Notifications ---
  getNotifications: () => api.get('/api/notifications'),
  markNotificationAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
  markNotificationsRead: () => api.put('/api/notifications/read-all'),

  // --- Advanced AI Recommendations ---
  getRecommendedFreelance: () => api.get('/api/recommendations/freelance'),
  getRecommendedScholarships: () => api.get('/api/recommendations/scholarships'),

  // --- CV Engine ---
  getCV: () => api.get('/api/cv'),
  generateCV: () => api.post('/api/cv/generate'),
  updateCV: (content) => api.put('/api/cv', { content }),
  downloadPDF: () => api.get('/api/cv/download/pdf', { responseType: 'blob' }),
  downloadDOCX: () => api.get('/api/cv/download/docx', { responseType: 'blob' }),
  uploadCV: (formData) => api.post('/api/cv/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // --- Company: Job Management ---
  postJob: (data) => api.post('/api/jobs', data),
  getCompanyJobs: () => api.get('/api/jobs/my'),
  updateJob: (id, data) => api.put(`/api/jobs/${id}`, data),
  getAllJobsRaw: () => api.get('/api/jobs'),

  // --- Client: Freelance Project Management ---
  postFreelanceProject: (data) => api.post('/api/freelance-projects', data),
  getClientProjects: () => api.get('/api/freelance-projects/my'),
  updateFreelanceProject: (id, data) => api.put(`/api/freelance-projects/${id}`, data),
  getAllFreelanceRaw: () => api.get('/api/freelance-projects'),

  // --- University: Scholarship Management ---
  postScholarship: (data) => api.post('/api/scholarships', data),
  getUniversityScholarships: () => api.get('/api/scholarships/my'),
  updateScholarship: (id, data) => api.put(`/api/scholarships/${id}`, data),
  getAllScholarshipsRaw: () => api.get('/api/scholarships'),

  // --- Company: Application Management ---
  getJobApplications: (jobId) => api.get(`/api/applications/job/${jobId}`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/api/applications/${applicationId}/status`, { status }),

  // --- Admin: Monitoring & Management ---
  getPendingValidations: () => api.get('/api/admin/pending'),
  getAdminStats: () => api.get('/api/admin/stats'),
  getRecentActivity: () => api.get('/api/admin/recent-activity'),
  getSystemHealth: () => api.get('/api/admin/system-health'),

  // --- Admin: Validation & Rejection ---
  validateOpportunity: (id, type) => {
    const slug = type.toLowerCase().includes('freelance') ? 'freelance-project' : type.toLowerCase();
    return api.put(`/api/admin/validate/${slug}/${id}`);
  },
  rejectOpportunity: (id, type, reason) => {
    const slug = type.toLowerCase().includes('freelance') ? 'freelance-project' : type.toLowerCase();
    return api.put(`/api/admin/reject/${slug}/${id}`, { reason });
  },
  requestChanges: (id, type, feedback) => {
    const slug = type.toLowerCase().includes('freelance') ? 'freelance-project' : type.toLowerCase();
    return api.post(`/api/admin/request-changes/${slug}/${id}`, { feedback });
  },

  // --- Admin: User Management ---
  getAdminUsers: async (params) => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/admin/users', { 
      params,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },
  toggleUserStatus: (id) => api.put(`/api/admin/users/${id}/status`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // --- Professional Network ---
  getNetworkFeed: () => api.get('/api/network/feed'),
  createPost: (content, tags = []) => api.post('/api/network/posts', { content, tags }),
  likePost: (postId) => api.put(`/api/network/posts/${postId}/like`),
  commentOnPost: (postId, content) => api.post(`/api/network/posts/${postId}/comment`, { content }),
  followUser: (userId) => api.post(`/api/network/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/api/network/follow/${userId}`),
  getNetworkStats: () => api.get('/api/network/stats'),
  getFollowing: () => api.get('/api/network/following'),
  searchUsers: (query) => api.get(`/api/users/search?q=${query}`),

  // --- File Upload ---
  uploadFile: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

