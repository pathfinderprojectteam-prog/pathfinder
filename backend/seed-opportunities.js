require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Client = require('./models/Client');
const University = require('./models/University');
const Job = require('./models/Job');
const FreelanceProject = require('./models/FreelanceProject');
const Scholarship = require('./models/Scholarship');
const Profile = require('./models/Profile');
const Education = require('./models/Education');
const Skill = require('./models/Skill');
const ProfessionalExperience = require('./models/ProfessionalExperience');

const {
  getRecommendedJobs,
  getRecommendedFreelanceProjects,
  getRecommendedScholarships
} = require('./services/recommendationService');
const { suggestCareerPath } = require('./services/careerPathService');

async function seedAndTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Seeding...");

    // 1. Create/Find the required Stakeholders
    let company = await Company.findOne();
    if (!company) {
      const u = await User.create({ name: 'Tech Giant', email: `comp-${Date.now()}@test.com`, password: '123', role: 'Company' });
      company = await Company.create({ _id: u._id, address: 'Global' });
    }

    let client = await Client.findOne();
    if (!client) {
      const u = await User.create({ name: 'Solo Client', email: `client-${Date.now()}@test.com`, password: '123', role: 'Client' });
      client = await Client.create({ _id: u._id });
    }

    let university = await University.findOne();
    if (!university) {
      const u = await User.create({ name: 'Global Uni', email: `uni-${Date.now()}@test.com`, password: '123', role: 'University' });
      university = await University.create({ _id: u._id, location: 'Global' });
    }

    // 2. Clear old opportunities if they exist (to ensure our test match scoring works clean)
    await Job.deleteMany({});
    await FreelanceProject.deleteMany({});
    await Scholarship.deleteMany({});

    // 3. Seed Jobs
    await Job.insertMany([
      { title: 'Frontend Developer', description: 'React and JS experts', requiredExperience: 2, requiredSkills: ['React', 'JavaScript'], company: company._id, validated: true },
      { title: 'Backend Developer', description: 'Node.js and Python API', requiredExperience: 3, requiredSkills: ['Nodejs', 'Python'], company: company._id, validated: true },
      { title: 'Data Scientist', description: 'Python Expert', requiredExperience: 1, requiredSkills: ['Python'], company: company._id, validated: true }
    ]);
    console.log("✅ Seeded 3 test Jobs");

    // 4. Seed Freelance
    await FreelanceProject.insertMany([
      { title: 'Build React Dashboard', description: 'Urgent task', difficulty: 'Intermediate', requiredSkills: ['React', 'JavaScript'], client: client._id, validated: true },
      { title: 'Script Python Automator', description: 'Quick script', difficulty: 'Beginner', requiredSkills: ['Python'], client: client._id, validated: true }
    ]);
    console.log("✅ Seeded 2 test Freelance Projects");

    // 5. Seed Scholarships
    await Scholarship.insertMany([
      { title: 'Global Tech Grant', academicLevelRequired: 'Bachelor', deadline: new Date('2026-12-31'), requiredSkills: ['Computer Science'], university: university._id, validated: true },
      { title: 'Women in Code Scholarship', academicLevelRequired: 'Bachelor', deadline: new Date('2026-12-31'), requiredSkills: ['Tech'], university: university._id, validated: true }
    ]);
    console.log("✅ Seeded 2 test Scholarships");

    // 6. Fetch the Test Student's profile (should be at 100%)
    const user = await User.findOne({ email: 'test.student@pathfinder.com' });
    if (!user) throw new Error("Seed account 'test.student@pathfinder.com' not found. Run seed-test-student.js first.");

    const profile = await Profile.findOne({ user: user._id })
      .populate('user', 'name email role')
      .populate('educations')
      .populate('skills')
      .populate('experiences');

    console.log(`\nTesting user: ${user.name} (${user.email})`);
    
    console.log("\n=== RECOMMENDED RESULTS ===");
    
    const jobs = await getRecommendedJobs(profile);
    console.log(`\n[JOBS] Found ${jobs.length} recommendations:`);
    jobs.forEach(j => console.log(`- ${j.title} | Score: ${j.matchScore}% | Reason: ${j.matchReason}`));

    const freelance = await getRecommendedFreelanceProjects(profile);
    console.log(`\n[FREELANCE] Found ${freelance.length} recommendations:`);
    freelance.forEach(f => console.log(`- ${f.title} | Score: ${f.matchScore}% | Reason: ${f.matchReason}`));

    const scholarships = await getRecommendedScholarships(profile);
    console.log(`\n[SCHOLARSHIPS] Found ${scholarships.length} recommendations:`);
    scholarships.forEach(s => console.log(`- ${s.title} | Score: ${s.matchScore}% | Reason: ${s.matchReason}`));

    console.log("\n\n--- AI CAREER PATH SUGGESTION (OpenRouter/free) ---");
    const path = await suggestCareerPath(profile);
    console.log(`AI Result: ${path.toUpperCase()}`);

    process.exit(0);
  } catch(e) {
    console.error("\n❌ SEED TEST ERROR:", e);
    process.exit(1);
  }
}

seedAndTest();
