const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  let completion = 0;

  // Bio / personal description -> 15%
  if (profile.bio && profile.bio.trim() !== '') {
    completion += 15;
  }

  // Education -> 20%
  if (profile.educations && profile.educations.length > 0) {
    completion += 20;
  }

  // Skills -> 25%
  if (profile.skills && profile.skills.length > 0) {
    completion += 25;
  }

  // Experience -> 25%
  if (profile.experiences && profile.experiences.length > 0) {
    completion += 25;
  }

  // Availability -> 15%
  if (profile.availability && profile.availability.trim() !== '') {
    completion += 15;
  }

  return Math.min(completion, 100); // Cap at 100% just in case
};

module.exports = { calculateProfileCompletion };
