const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

// Models
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Client = require('./models/Client');
const University = require('./models/University');
const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Education = require('./models/Education');
const ProfessionalExperience = require('./models/ProfessionalExperience');
const Job = require('./models/Job');
const FreelanceProject = require('./models/FreelanceProject');
const Scholarship = require('./models/Scholarship');
const Application = require('./models/Application');

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pathfinder');
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Wiping existing data...');
    await Promise.all([
      User.deleteMany(),
      Profile.deleteMany(),
      Skill.deleteMany(),
      Education.deleteMany(),
      ProfessionalExperience.deleteMany(),
      Job.deleteMany(),
      FreelanceProject.deleteMany(),
      Scholarship.deleteMany(),
      Application.deleteMany(),
    ]);

    // Passwords setup
    const salt = await bcrypt.genSalt(10);
    // Hashing here specifically for create, though our pre-save hook handles it.
    // If the hook is active, we just pass the raw password to create(). 
    const plainPassword = 'password123';

    console.log('👤 Seeding Users...');
    
    // Admin
    const admin = await Admin.create({
      name: 'System Administrator',
      email: 'admin@pathfinder.tn',
      password: plainPassword,
      role: 'Admin'
    });

    // Companies
    const companiesData = [
      { name: 'Telnet', email: 'hr@telnet.com.tn', industry: 'Engineering', companySize: 500 },
      { name: 'Vermeg', email: 'careers@vermeg.com', industry: 'FinTech', companySize: 1200 },
      { name: 'BIAT', email: 'recrutement@biat.com.tn', industry: 'Banking', companySize: 2000 },
      { name: 'InstaDeep', email: 'ai@instadeep.tn', industry: 'Artificial Intelligence', companySize: 300 },
      { name: 'Wevioo', email: 'contact@wevioo.com', industry: 'Consulting', companySize: 450 }
    ];
    const createdCompanies = await Promise.all(
      companiesData.map(c => Company.create({ ...c, password: plainPassword, role: 'Company' }))
    );

    // Clients (Freelance)
    const clientsData = [
      { name: 'Ahmed Trabelsi', email: 'ahmed@startup.tn' },
      { name: 'Rania Mansour', email: 'rania.m@gmail.com' },
      { name: 'Sami Bouzid', email: 's.bouzid@agency.tn' },
      { name: 'Yosra Ben Ali', email: 'yosra.design@outlook.com' },
      { name: 'Karim Chaabane', email: 'k.chaabane@ecommerce.tn' }
    ];
    const createdClients = await Promise.all(
      clientsData.map(c => Client.create({ ...c, password: plainPassword, role: 'Client' }))
    );

    // Universities
    const universitiesData = [
      { name: 'INSAT (Institut National des Sciences Appliquées)', email: 'contact@insat.rnu.tn' },
      { name: 'FST (Faculté des Sciences de Tunis)', email: 'admin@fst.rnu.tn' },
      { name: 'ENIT (Ecole Nationale d’Ingénieurs de Tunis)', email: 'direction@enit.rnu.tn' }
    ];
    const createdUniversities = await Promise.all(
      universitiesData.map(u => University.create({ ...u, password: plainPassword, role: 'University' }))
    );

    // Students
    const studentsData = [
      { name: 'Bilel M.', email: 'bilel@student.tn' },
      { name: 'Aziz K.', email: 'aziz@student.tn' },
      { name: 'Amina G.', email: 'amina@student.tn' },
      { name: 'Sofien L.', email: 'sofien@student.tn' },
      { name: 'Nour T.', email: 'nour@student.tn' },
      { name: 'Wassim B.', email: 'wassim@student.tn' },
      { name: 'Farah S.', email: 'farah@student.tn' },
      { name: 'Hatem R.', email: 'hatem@student.tn' },
      { name: 'Salma D.', email: 'salma@student.tn' },
      { name: 'Omar J.', email: 'omar@student.tn' }
    ];
    const createdStudents = await Promise.all(
      studentsData.map(s => Student.create({ ...s, password: plainPassword, role: 'Student', profileCompletion: 0 }))
    );

    console.log('📝 Seeding Profiles & Resumes...');
    
    for (const student of createdStudents) {
      const profile = await Profile.create({
        user: student._id,
        bio: `Driven software engineering student based in Tunis, specializing in full-stack web and systems architecture.`,
        availability: 'Immediate',
      });

      // Education
      const edu = await Education.create({
        profile: profile._id,
        degree: 'Software Engineering Diploma',
        institution: universitiesData[Math.floor(Math.random() * universitiesData.length)].name,
        field: 'Computer Science',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2026-06-30')
      });

      // Skills
      const skillsToCreate = ['JavaScript', 'React', 'Node.js', 'Python'].map(name => ({
        profile: profile._id,
        name,
        level: ['Advanced', 'Intermediate'][Math.floor(Math.random() * 2)]
      }));
      const skills = await Skill.insertMany(skillsToCreate);

      // Experience
      const exp = await ProfessionalExperience.create({
        profile: profile._id,
        title: 'Summer Intern',
        company: companiesData[Math.floor(Math.random() * companiesData.length)].name,
        years: 0.5,
        description: 'Developed internal web dashboards using React and Express.'
      });

      profile.educations.push(edu._id);
      profile.skills.push(...skills.map(s => s._id));
      profile.experiences.push(exp._id);
      await profile.save();
      
      // Update student profile ref
      await Student.findByIdAndUpdate(student._id, { profile: profile._id, profileCompletion: 85 });
    }

    console.log('💼 Seeding Jobs...');
    const jobsToCreate = [];
    createdCompanies.forEach(company => {
      // 2 jobs per company
      jobsToCreate.push({
        title: 'Full Stack JavaScript Engineer',
        description: `Join our core platform team in Tunis to scale our microservices. Minimum 2 years Node.js experience required. Remote optional.`,
        requiredExperience: 2,
        company: company._id,
        validated: true
      });
      jobsToCreate.push({
        title: 'Frontend React Developer',
        description: `Looking for a UI developer specialized in React and Tailwind for a fintech dashboard project based in Sousse.`,
        requiredExperience: 1,
        company: company._id,
        validated: true
      });
    });
    const createdJobs = await Job.insertMany(jobsToCreate);


    console.log('🚀 Seeding Freelance Projects...');
    const projectsToCreate = [];
    createdClients.forEach(client => {
      // 2 projects per client
      projectsToCreate.push({
        title: 'E-commerce Mobile App MVP',
        description: `Need a React Native developer to build a delivery app MVP targeting the Sfax market. API is already built.`,
        difficulty: 'Intermediate',
        client: client._id,
        validated: true
      });
      projectsToCreate.push({
        title: 'Landing Page for Startup',
        description: `Simple HTML/TailwindCSS SaaS landing page. Looking for clean design. Based in Tunis.`,
        difficulty: 'Beginner',
        client: client._id,
        validated: true
      });
    });
    const createdProjects = await FreelanceProject.insertMany(projectsToCreate);


    console.log('🎓 Seeding Scholarships...');
    const scholarshipsToCreate = [];
    createdUniversities.forEach(uni => {
      scholarshipsToCreate.push({
        title: 'Excellence STEM Scholarship',
        description: 'Full tuition coverage for outstanding engineering students enrolled in AI specific tracks. Issued by state funding.',
        amount: 5000,
        deadline: new Date('2026-12-31'),
        academicLevelRequired: 'Master',
        university: uni._id,
        validated: true
      });
      scholarshipsToCreate.push({
        title: 'International Exchange Grant',
        description: 'Semester abroad funding for highest graduating GPA students in computer science.',
        amount: 2500,
        deadline: new Date('2026-10-15'),
        academicLevelRequired: 'Bachelor',
        university: uni._id,
        validated: true
      });
    });
    // Remove the last one to make it 5 total
    scholarshipsToCreate.pop(); 
    await Scholarship.insertMany(scholarshipsToCreate);

    console.log('✅ Seeding Applications...');
    // Seed a few applications to jobs & projects
    for (let i = 0; i < 5; i++) {
        await Application.create({
            student: createdStudents[i]._id,
            job: createdJobs[i]._id,
            status: 'pending'
        });
    }

    console.log('🎉 Database seeding complete!');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
