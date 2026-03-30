const { calculateProfileCompletion } = require('./profileCompletionService');

/**
 * Analyze a student profile and suggest the most appropriate career path.
 *
 * Decision tree:
 *   1. Profile completion < 50%                                  → "complete_profile"
 *   2. No skills + no experiences + no educations                → "complete_profile"
 *   3. Has professional experience                               → "job"
 *   4. Has skills (no experience)                                → "freelance"
 *   5. Otherwise                                                 → "study"
 */
const suggestCareerPath = (profile) => {
  if (!profile) return 'complete_profile';

  const completion = calculateProfileCompletion(profile);
  if (completion < 50) return 'complete_profile';

  const hasExperiences = Array.isArray(profile.experiences) && profile.experiences.length > 0;
  const hasSkills      = Array.isArray(profile.skills)      && profile.skills.length      > 0;
  const hasEducations  = Array.isArray(profile.educations)  && profile.educations.length  > 0;

  if (!hasExperiences && !hasSkills && !hasEducations) return 'complete_profile';
  if (hasExperiences) return 'job';
  if (hasSkills)      return 'freelance';
  return 'study';
};

module.exports = { suggestCareerPath };
