require('dotenv').config();
const { calculateProfileCompletion } = require('./services/profileCompletionService');
const { calculateMatchScore } = require('./services/matchScoreService');
const { suggestCareerPath } = require('./services/careerPathService');
const { generateAISummary } = require('./services/cvGeneratorService');

async function runTests() {
  console.log('--- STARTING SERVICE TESTS ---');

  // Test Profile Completion
  try {
    const p1 = { bio: 'A', educations: [{ degree: 'B' }], skills: [{ name: 'C' }], experiences: [{ title: 'D' }], careerObjective: 'E' };
    const score = calculateProfileCompletion(p1);
    console.log(`[profileCompletionService] Full Profile Score: ${score}% (Expected: 100%)`);
  } catch(e) {
    console.error(`[profileCompletionService] ERROR:`, e.message);
  }

  // Test Match Score
  try {
    const profile = {
      skills: [{name: 'React'}, {name: 'Node'}],
      educations: [{level: 2}],
      experiences: [{years: 3}]
    };
    const job = {
      requiredSkills: ['Node'],
      requiredDegreeLevel: 1,
      requiredExperience: 2
    };
    const match = calculateMatchScore(profile, job);
    console.log(`[matchScoreService] Computed Score: ${match.score} | Reason: ${match.reason}`);
  } catch(e) {
    console.error(`[matchScoreService] ERROR:`, e.message);
  }

  // Test Career Path Service (OpenRouter)
  try {
    const profile = {
      skills: [{name: 'JavaScript'}, {name: 'React'}],
      educations: [{degree: 'BSc Computer Science', level: 1}],
      experiences: [{title: 'Intern', years: 1}],
      careerObjective: 'Software Engineer',
      bio: 'test',
      cvFile: 'test'
    };
    console.log('[careerPathService] Making API request...');
    const path = await suggestCareerPath(profile);
    console.log(`[careerPathService] Suggested Path: ${path}`);
  } catch(e) {
    console.error(`[careerPathService] ERROR:`, e.message);
  }

  // Test CV Generator Service (OpenRouter)
  try {
    const profile = {
      user: { name: 'Test User', email: 'test@example.com' },
      skills: [{name: 'JavaScript'}, {name: 'React'}]
    };
    console.log('[cvGeneratorService] Making API request for summary...');
    // test the helper instead of the full docgen for speed
    const summary = await generateAISummary(profile, 'Developer');
    console.log(`[cvGeneratorService] Generated summary:\n${summary}`);
  } catch(e) {
    console.error(`[cvGeneratorService] ERROR:`, e.message);
  }

  console.log('--- TESTS COMPLETE ---');
  process.exit(0);
}

runTests();
