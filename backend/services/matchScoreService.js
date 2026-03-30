/**
 * Calculate how well a student profile matches an opportunity.
 *
 * Scoring breakdown:
 *   50% – Skills match (at least one skill in common)
 *   30% – Experience match (user meets or exceeds required experience)
 *   20% – Education match (user has at least one education entry)
 *
 * @param {Object} profile     – Populated student profile (skills, experiences, educations)
 * @param {Object} opportunity – Job, FreelanceProject, or Scholarship document
 * @returns {Object} Object containing { score, reason }
 */
const calculateMatchScore = (profile, opportunity) => {
  let score = 0;
  const reasons = [];

  // ── 1. Skills Match (50 pts) ───────────────────────────────────────────────
  const profileSkills = (profile.skills || []).map((s) =>
    s.name.toLowerCase().trim()
  );

  const requiredSkills = (opportunity.requiredSkills || []).map((s) =>
    s.toLowerCase().trim()
  );

  const hasSkillMatch =
    requiredSkills.length === 0 ||
    profileSkills.some((skill) => requiredSkills.includes(skill));

  if (hasSkillMatch) {
    score += 50;
    reasons.push('Skill match found');
  }

  // ── 2. Experience Match (30 pts) ──────────────────────────────────────────
  const requiredExperience = opportunity.requiredExperience || 0;

  const totalUserExperience = (profile.experiences || []).reduce(
    (total, exp) => total + (exp.years || 0),
    0
  );

  if (totalUserExperience >= requiredExperience) {
    score += 30;
    reasons.push('Experience requirement satisfied');
  }

  // ── 3. Education Match (20 pts) ───────────────────────────────────────────
  if (profile.educations && profile.educations.length > 0) {
    score += 20;
    reasons.push('Education background present');
  }

  return {
    score,
    reason: reasons.join(', '),
  };
};

module.exports = { calculateMatchScore };

