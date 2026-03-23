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
 * @returns {number} Score between 0 and 100
 */
const calculateMatchScore = (profile, opportunity) => {
  let score = 0;

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
  }

  // ── 2. Experience Match (30 pts) ──────────────────────────────────────────
  const requiredExperience = opportunity.requiredExperience || 0;

  const totalUserExperience = (profile.experiences || []).reduce(
    (total, exp) => total + (exp.years || 0),
    0
  );

  if (totalUserExperience >= requiredExperience) {
    score += 30;
  }

  // ── 3. Education Match (20 pts) ───────────────────────────────────────────
  if (profile.educations && profile.educations.length > 0) {
    score += 20;
  }

  return score; // 0 – 100
};

module.exports = { calculateMatchScore };
