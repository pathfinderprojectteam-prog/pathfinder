const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  let completion = 0;

  // 1. Personal Information (15%)
  // Full name, Email (on User), Phone, Location (city, country), Profile picture (optional)
  // We assume user name/email exist since they are required for account creation
  const hasPersonal = !!(profile.phone && profile.location && profile.location.city && profile.location.country);
  if (hasPersonal) {
    completion += 15;
  }

  // 2. Education (15%)
  // Degree name, Field of study, Institution name, Year of graduation, GPA (optional)
  if (profile.educations && profile.educations.length > 0) {
    const hasValidEd = profile.educations.some(ed => ed.degree && ed.field && ed.institution && ed.yearOfGraduation);
    if (hasValidEd) completion += 15;
  }

  // 2.5 Academic Details (10%) - Required for Scholarship Eligibility
  const hasAcademic = !!(profile.gpa !== undefined && profile.fieldOfStudy && profile.degreeLevel && profile.yearsOfStudy !== undefined);
  if (hasAcademic) {
    completion += 10;
  }

  // 3. Skills (20%)
  // Skill name, Proficiency level, Years of experience
  if (profile.skills && profile.skills.length > 0) {
    const hasValidSkill = profile.skills.some(sk => sk.name && sk.level && sk.yearsExperience !== undefined);
    if (hasValidSkill) completion += 20;
  }

  // 4. Experience (25%)
  // Job title, Company name, Start date, End date (or Predict), Description
  if (profile.experiences && profile.experiences.length > 0) {
    const hasValidExp = profile.experiences.some(ex => ex.title && ex.company && ex.startDate && (ex.endDate || ex.isCurrent) && ex.description);
    if (hasValidExp) completion += 25;
  }

  // 5. Career Objective (15%)
  // Target job title, Preferred work type, Desired salary range, Industries interested in
  if (profile.careerObjective) {
    const obj = profile.careerObjective;
    if (obj.targetJobTitle && obj.preferredWorkType && obj.desiredSalary && obj.industries && obj.industries.length > 0) {
      completion += 15;
    }
  }

  return Math.min(completion, 100); 
};

/**
 * Validates if the user can receive recommendations.
 * Blocks recommendations if profile completion is < 100%.
 */
const canReceiveRecommendations = (profile) => {
  const score = calculateProfileCompletion(profile);
  return score === 100;
};

module.exports = { 
  calculateProfileCompletion,
  canReceiveRecommendations
};
