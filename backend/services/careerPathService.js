const axios = require('axios');
const { calculateProfileCompletion } = require('./profileCompletionService');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'dummy_key'; // Required in .env
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Suggest a career path using OpenRouter API (meta-llama/llama-3.1-8b-instruct:free)
 * @param {Object} profile - Populated student profile
 * @returns {Promise<String>} 'employment' | 'freelance' | 'studies' | 'hybrid'
 */
const suggestCareerPath = async (profile) => {
  if (!profile) throw new Error('Profile is required');

  const completion = calculateProfileCompletion(profile);
  if (completion < 100) {
    throw new Error('Please complete your profile to 100% to receive career path suggestions.');
  }

  // Extract relevant information
  const skills = (profile.skills || []).map(s => s.name).join(', ');
  const experiences = (profile.experiences || []).map(e => `${e.title} (${e.years} years)`).join(', ');
  const educations = (profile.educations || []).map(e => `${e.degree} - Level ${e.level}`).join(', ');
  const objective = profile.careerObjective || 'None provided';

  const prompt = `
    Analyze the following professional profile and determine the BEST single career path out of the following exactly 4 options: 'employment', 'freelance', 'studies', or 'hybrid'. 
    
    Candidate Data:
    - Degree/Education: ${educations || 'None'}
    - Skills: ${skills || 'None'}
    - Experience: ${experiences || 'None'}
    - Objective: ${objective}
    
    Only output the single path option (e.g. employment) with no formatting or other text.
  `;

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let path = response.data.choices[0].message.content.trim().toLowerCase();
    
    // Normalize response in case the LLM outputs extra text or casing
    if (path.includes('freelance')) return 'freelance';
    if (path.includes('employment')) return 'employment';
    if (path.includes('studies') || path.includes('education')) return 'studies';
    if (path.includes('hybrid')) return 'hybrid';

    // Default fallback based on logic if LLM fails strict format
    return 'employment'; 

  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate career path via AI. Please try again later.');
  }
};

module.exports = { suggestCareerPath };
