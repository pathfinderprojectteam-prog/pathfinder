/**
 * Generate a structured CV object from a populated student profile.
 *
 * @param {Object} profile - Populated student profile document
 * @returns {Object} Structured CV object
 */
const generateCV = (profile) => {
  if (!profile) return null;

  // Ensure default arrays to avoid nulls
  const bio = profile.bio || '';
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const education = Array.isArray(profile.educations) ? profile.educations : [];
  const experience = Array.isArray(profile.experiences) ? profile.experiences : [];

  // Extract skill names for the summary
  const skillNames = skills.map((s) => s.name || s).filter(Boolean);

  // Generate summary
  let summary = '';
  if (bio.trim()) {
    summary = bio.trim();
  } else if (skillNames.length > 0) {
    summary = `Motivated individual with skills in ${skillNames.join(', ')}.`;
  } else {
    summary = 'Motivated individual seeking new opportunities.';
  }

  // Format and return CV structure
  return {
    personalInfo: {
      bio,
    },
    summary,
    skills: skillNames,
    education,
    experience,
  };
};

module.exports = {
  generateCV,
};
