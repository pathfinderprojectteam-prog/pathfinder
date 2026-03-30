const Job = require('../models/Job');
const FreelanceProject = require('../models/FreelanceProject');
const Scholarship = require('../models/Scholarship');
const { calculateMatchScore } = require('./matchScoreService');
const { calculateProfileCompletion } = require('./profileCompletionService');

const TOP_N = 10;
const MIN_SCORE = 50;

/**
 * Score, filter, and rank a list of opportunities against a student profile.
 * @param {Object[]} opportunities
 * @param {Object}   profile
 * @returns {Object[]} Top N opportunities with score attached, sorted descending
 */
const rankOpportunities = (opportunities, profile) => {
  const completion = calculateProfileCompletion(profile);

  return opportunities
    .map((opp) => {
      const plain = opp.toObject ? opp.toObject() : opp;
      const result = calculateMatchScore(profile, plain);
      
      let finalScore = result.score;
      let finalReason = result.reason;

      if (completion < 50) {
        finalScore = Math.max(0, finalScore - 20);
        finalReason += finalReason 
          ? ', Low profile completion affects recommendation' 
          : 'Low profile completion affects recommendation';
      }

      return { 
        ...plain, 
        matchScore: finalScore, 
        matchReason: finalReason 
      };
    })
    .filter((opp) => opp.matchScore >= MIN_SCORE)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, TOP_N);
};

/**
 * Recommend validated jobs for a given student profile.
 * @param {Object} profile – Populated profile (skills, experiences, educations)
 * @returns {Promise<Object[]>}
 */
const getRecommendedJobs = async (profile) => {
  const jobs = await Job.find({ validated: true }).lean();
  return rankOpportunities(jobs, profile);
};

/**
 * Recommend validated freelance projects for a given student profile.
 * @param {Object} profile
 * @returns {Promise<Object[]>}
 */
const getRecommendedFreelanceProjects = async (profile) => {
  const projects = await FreelanceProject.find({ validated: true }).lean();
  return rankOpportunities(projects, profile);
};

/**
 * Recommend validated scholarships for a given student profile.
 * @param {Object} profile
 * @returns {Promise<Object[]>}
 */
const getRecommendedScholarships = async (profile) => {
  const scholarships = await Scholarship.find({ validated: true }).lean();
  return rankOpportunities(scholarships, profile);
};

module.exports = {
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships,
};
