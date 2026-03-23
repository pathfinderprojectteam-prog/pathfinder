/**
 * Analyze a student profile and suggest the most appropriate career path.
 *
 * Decision tree:
 *   1. Profile incomplete (missing skills AND experiences AND educations) → "complete_profile"
 *   2. Has professional experience                                       → "job"
 *   3. Has skills but no experience                                      → "freelance"
 *   4. Otherwise (only education or empty profile)                       → "study"
 *
 * @param {Object} profile – Populated student profile
 * @returns {string} "job" | "freelance" | "study" | "complete_profile"
 */
const suggestCareerPath = (profile) => {
  if (!profile) return 'complete_profile';

  const hasExperiences = Array.isArray(profile.experiences) && profile.experiences.length > 0;
  const hasSkills      = Array.isArray(profile.skills)      && profile.skills.length      > 0;
  const hasEducations  = Array.isArray(profile.educations)  && profile.educations.length  > 0;

  // Guard: profile is critically empty
  if (!hasExperiences && !hasSkills && !hasEducations) {
    return 'complete_profile';
  }

  if (hasExperiences) return 'job';
  if (hasSkills)      return 'freelance';
  return 'study';
};

module.exports = { suggestCareerPath };
