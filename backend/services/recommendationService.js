const axios = require('axios');
const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');
const { calculateMatchScore } = require('./matchScoreService');
const { calculateProfileCompletion, canReceiveRecommendations } = require('./profileCompletionService');

const GORSE_URL = process.env.GORSE_URL || 'http://localhost:8088';
const GORSE_API_KEY = process.env.GORSE_API_KEY || ''; // If applicable

const gorseClient = axios.create({
  baseURL: GORSE_URL,
  headers: GORSE_API_KEY ? { 'X-API-Key': GORSE_API_KEY } : {}
});

/**
 * Insert or update a user (Student) into Gorse
 */
const insertUserIntoGorse = async (userId, profileData) => {
  try {
    await gorseClient.post('/api/user', {
      UserId: userId.toString(),
      Labels: profileData.skills || [],
      Comment: 'Student Profile Sync'
    });
  } catch (err) {
    console.error('Gorse User Sync Error:', err.message);
  }
};

/**
 * Insert or update an item (Job/Freelance/Scholarship) into Gorse
 */
const insertItemIntoGorse = async (itemId, type, metadata) => {
  try {
    await gorseClient.post('/api/item', {
      ItemId: itemId.toString(),
      IsHidden: false,
      Categories: [type], // e.g. 'job', 'freelance', 'scholarship'
      Timestamp: new Date().toISOString(),
      Labels: metadata.skills || [],
      Comment: `${type} insertion`
    });
  } catch (err) {
    console.error('Gorse Item Sync Error:', err.message);
  }
};

/**
 * Get personalized recommendations for a user via Gorse & match scoring fallback
 */
const getRecommendedItems = async (profile, type) => {
  if (!canReceiveRecommendations(profile)) {
    throw new Error('Profile must be 100% complete to receive recommendations.');
  }

  let recommendedItemIds = [];
  try {
    // Attempt to get items from Gorse Recommender
    const response = await gorseClient.get(`/api/recommend/${profile.user.toString()}/${type}?n=10`);
    recommendedItemIds = response.data || [];
  } catch (error) {
    console.warn('Gorse Recommendation Failed, falling back to dynamic score calculation:', error.message);
  }

  // Fetch from DB based on type
  let dbItems = [];
  if (type === 'job') dbItems = await Job.find({ validated: true }).lean();
  if (type === 'freelance') dbItems = await FreelanceProject.find({ validated: true }).lean();
  if (type === 'scholarship') dbItems = await Scholarship.find({ validated: true }).lean();

  // If Gorse returned IDs, filter DB items and add dummy matchScore
  if (recommendedItemIds.length > 0) {
    return dbItems
      .filter((item) => recommendedItemIds.includes(item._id.toString()))
      .map(item => ({
        ...item,
        matchScore: calculateMatchScore(profile, item).score,
        matchReason: 'AI Recommended'
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  // Fallback: Use manual formula scoring via matchScoreService
  return dbItems
    .map(item => {
      const match = calculateMatchScore(profile, item);
      return { ...item, matchScore: match.score, matchReason: match.reason };
    })
    .filter(item => item.matchScore >= 50)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
};

const getRecommendedJobs = (profile) => getRecommendedItems(profile, 'job');
const getRecommendedFreelanceProjects = (profile) => getRecommendedItems(profile, 'freelance');
const getRecommendedScholarships = (profile) => getRecommendedItems(profile, 'scholarship');

module.exports = {
  insertUserIntoGorse,
  insertItemIntoGorse,
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships,
};
