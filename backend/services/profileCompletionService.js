const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  let completion = 0;

  // Bio / personal description -> 10%
  if (profile.bio && profile.bio.trim() !== '') {
    completion += 10;
  }

  // Education -> 20%
  if (profile.educations && profile.educations.length > 0) {
    completion += 20;
  }

  // Skills -> 20%
  if (profile.skills && profile.skills.length > 0) {
    completion += 20;
  }

  // Experience -> 20%
  if (profile.experiences && profile.experiences.length > 0) {
    completion += 20;
  }

  // Availability -> 10%
  if (profile.availability && profile.availability.trim() !== '') {
    completion += 10;
  }

  // Avatar -> 10%
  if (profile.avatar && profile.avatar.trim() !== '') {
    completion += 10;
  }

  // CV -> 10%
  if (profile.cvFile && profile.cvFile.trim() !== '') {
    completion += 10;
  }

  return Math.min(completion, 100); 
};

module.exports = { calculateProfileCompletion };
