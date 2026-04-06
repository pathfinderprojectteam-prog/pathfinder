require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Student = require('./models/Student');
const Profile = require('./models/Profile');
const Education = require('./models/Education');
const Skill = require('./models/Skill');
const ProfessionalExperience = require('./models/ProfessionalExperience');
const { calculateProfileCompletion } = require('./services/profileCompletionService');

async function seedTestStudent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Create User
    let user = await User.findOne({ email: 'test.student@pathfinder.com' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Test123456', salt);
      user = await User.create({
        name: 'Test Student',
        email: 'test.student@pathfinder.com',
        password: hashedPassword,
        role: 'Student'
      });
      console.log("User 'Test Student' registered.");
    } else {
      console.log("User already exists.");
    }

    // Ensure Student document
    let student = await Student.findById(user._id);
    if (!student) {
      student = await Student.create({ _id: user._id, profileCompletion: 0 });
    }

    // 2. Wipe old profile data
    await Profile.deleteOne({ user: user._id });
    await Education.deleteMany({ profile: { $ne: null } }); 
    await Skill.deleteMany({ profile: { $ne: null } });
    await ProfessionalExperience.deleteMany({ profile: { $ne: null } });

    // 3. Create raw Profile
    const profile = await Profile.create({
      user: user._id,
      phone: '+216 98765432',
      location: { city: 'Tunis', country: 'Tunisia' },
      bio: 'Motivated computer science student seeking opportunities in web development',
      careerObjective: {
        targetJobTitle: 'Frontend Developer',
        preferredWorkType: 'Remote',
        desiredSalary: '$25,000 - $35,000',
        industries: ['Tech', 'Startups']
      }
    });

    // 4. Create Education
    const ed = await Education.create({
      profile: profile._id,
      degree: "Bachelor's Degree",
      field: 'Computer Science',
      institution: 'University of Tunis',
      yearOfGraduation: 2025,
      gpa: '3.5'
    });
    profile.educations.push(ed._id);

    // 5. Create Skills
    const skillsData = [
      { name: 'JavaScript', level: 'Intermediate', yearsExperience: 2 },
      { name: 'React', level: 'Beginner', yearsExperience: 1 },
      { name: 'Python', level: 'Intermediate', yearsExperience: 2 },
      { name: 'HTML/CSS', level: 'Advanced', yearsExperience: 3 },
      { name: 'Git', level: 'Intermediate', yearsExperience: 2 }
    ];
    for (let s of skillsData) {
      const sp = await Skill.create({ profile: profile._id, ...s });
      profile.skills.push(sp._id);
    }

    // 6. Create Experience
    const exp = await ProfessionalExperience.create({
      profile: profile._id,
      title: 'Web Developer Intern',
      company: 'Tech Startup',
      startDate: new Date('2025-01-01'),
      isCurrent: true,
      description: 'Developing frontend components using React'
    });
    profile.experiences.push(exp._id);

    await profile.save();

    // 7. Calculate Completion
    const populatedProfile = await Profile.findById(profile._id)
      .populate('educations')
      .populate('skills')
      .populate('experiences');

    const completion = calculateProfileCompletion(populatedProfile);
    student.profileCompletion = completion;
    await student.save();

    console.log(`\n========= SEED RESULT =========`);
    console.log(`Profile Completion Level: ${completion}%`);
    if (completion === 100) {
      console.log(`✅ 100% Target Matched!`);
    } else {
      console.log(`❌ Failed to hit 100%. Check completeness tracker.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedTestStudent();
