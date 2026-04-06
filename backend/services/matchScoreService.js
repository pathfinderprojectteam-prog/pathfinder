/**
 * Calculate how well a profile matches an opportunity using the exact formula:
 * Score = (SkillMatch × 0.5) + (DegreeMatch × 0.2) + (ExperienceMatch × 0.3)
 *
 * @param {Object} profile - Populated student profile
 * @param {Object} opportunity - Job, FreelanceProject, or Scholarship
 * @returns {Object} { score, reason }
 */
const calculateMatchScore = (profile, opportunity) => {
  let Score = 0;
  let SkillMatch = 0;
  let DegreeMatch = 0;
  let ExperienceMatch = 0;
  const reasons = [];

  // --- 1. SkillMatch (0 to 100)
  const profileSkills = (profile.skills || []).map((s) => s.name.toLowerCase().trim());
  const requiredSkills = (opportunity.requiredSkills || []).map((s) => s.toLowerCase().trim());
  
  if (requiredSkills.length > 0) {
    const matchedSkills = profileSkills.filter((skill) => requiredSkills.includes(skill));
    SkillMatch = (matchedSkills.length / requiredSkills.length) * 100;
    if (SkillMatch > 0) reasons.push(`${Math.round(SkillMatch)}% skill match`);
  } else if (profileSkills.length > 0) {
    // If no required skills, but user has skills, grant full match
    SkillMatch = 100;
    reasons.push('General skills match');
  }

  // --- 2. DegreeMatch (0 to 100)
  const requiredLevel = opportunity.requiredDegreeLevel || 0; // e.g., 0=Any, 1=Bachelor, 2=Master
  if (requiredLevel > 0) {
    // Find the max degree level the user has (assuming educations have a 'level' field)
    const userMaxLevel = (profile.educations || []).reduce((max, edu) => {
      return Math.max(max, edu.level || 1);
    }, 0);
    
    if (userMaxLevel >= requiredLevel) {
      DegreeMatch = 100;
      reasons.push('Degree requirement satisfied');
    } else if (userMaxLevel > 0) {
      DegreeMatch = 50; // Partial
      reasons.push('Partial degree match');
    }
  } else {
    DegreeMatch = 100;
  }

  // --- 3. ExperienceMatch (0 to 100)
  const requiredExp = opportunity.requiredExperience || 0;
  if (requiredExp > 0) {
    const userExp = (profile.experiences || []).reduce((total, exp) => total + (exp.years || 0), 0);
    if (userExp >= requiredExp) {
      ExperienceMatch = 100;
      reasons.push('Experience requirement satisfied');
    } else {
      ExperienceMatch = (userExp / requiredExp) * 100;
      if (ExperienceMatch > 0) reasons.push(`${Math.round(ExperienceMatch)}% experience match`);
    }
  } else {
    ExperienceMatch = 100;
  }

  // Calculate final score based on the formula
  Score = (SkillMatch * 0.5) + (DegreeMatch * 0.2) + (ExperienceMatch * 0.3);

  // Fallback reason if it's a perfect blanket match
  if (reasons.length === 0 && Score > 0) {
    reasons.push('General profile compatibility');
  }

  return {
    score: Math.round(Score),
    reason: reasons.join(', ')
  };
};

module.exports = { calculateMatchScore };
