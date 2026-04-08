const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const Job = require('../backend/models/Job');
const FreelanceProject = require('../backend/models/FreelanceProject');
const Scholarship = require('../backend/models/Scholarship');

async function checkStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const jobs = await Job.find({ title: /Developpeur/i });
    console.log('\n--- JOBS ---');
    jobs.forEach(j => console.log(`Title: ${j.title}, Status: ${j.status}`));

    const freelance = await FreelanceProject.find({ title: /E-commerce/i });
    console.log('\n--- FREELANCE ---');
    freelance.forEach(f => console.log(`Title: ${f.title}, Status: ${f.status}`));

    const scholarships = await Scholarship.find({ title: /INSAT/i });
    console.log('\n--- SCHOLARSHIPS ---');
    scholarships.forEach(s => console.log(`Title: ${s.title}, Status: ${s.status}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkStatus();
