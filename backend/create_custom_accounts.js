require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Client = require('./models/Client');
const University = require('./models/University');
const Admin = require('./models/Admin');
const Profile = require('./models/Profile');

async function createAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const accounts = [
      { name: 'Admin', email: 'admin@pathfinder.com', password: 'Admin123', role: 'Admin' },
      { name: 'ISET Tunis', email: 'iset@gmail.com', password: '123456', role: 'University' },
      { name: 'CPG Tunisie', email: 'cpg@gmail.com', password: '123456', role: 'Company' },
      { name: 'Upwork Client', email: 'upwork@gmail.com', password: '123456', role: 'Client' },
      { name: 'Bilel Ben Ali', email: 'bilel2025@gmail.com', password: '123456', role: 'Student' }
    ];

    for (const acc of accounts) {
      console.log(`\nProcessing: ${acc.email}`);
      
      // Step 1: Delete existing user
      await User.deleteOne({ email: acc.email });
      console.log(`Deleted existing user ${acc.email}`);

      // Step 2 & 3: Create user and corresponding profile
      let user;
      if (acc.role === 'Admin') {
        user = await User.create(acc);
      } else if (acc.role === 'Student') {
        user = await Student.create({ ...acc, profileCompletion: 100 });
        await Profile.create({
          user: user._id,
          phone: '+216 98 765 432',
          location: { city: 'Tunis', country: 'Tunisia' },
          bio: 'Etudiant en 3eme annee Genie Logiciel a l\'INSAT',
          gpa: 3.2,
          fieldOfStudy: 'Computer Science',
          degreeLevel: 'Bachelor',
          yearsOfStudy: 3
        });
      } else if (acc.role === 'Company') {
        user = await Company.create({ ...acc, industry: 'Mining/Industrial', companySize: 1000 });
        await Profile.create({
          user: user._id,
          phone: '+216 71 000 000',
          location: { city: 'Gafsa', country: 'Tunisia' },
          companyName: 'CPG Tunisie',
          industry: 'Industrial'
        });
      } else if (acc.role === 'Client') {
        user = await Client.create(acc);
        await Profile.create({
          user: user._id,
          phone: '+1 650 000 000',
          location: { city: 'San Francisco', country: 'USA' },
          bio: 'Global freelance facilitation platform'
        });
      } else if (acc.role === 'University') {
        user = await University.create(acc);
        await Profile.create({
          user: user._id,
          phone: '+216 71 111 111',
          location: { city: 'Tunis', country: 'Tunisia' },
          institutionType: 'Public',
          programs: ['Engineering', 'Technology']
        });
      }
      
      console.log(`Successfully created ${acc.role}: ${acc.email}`);
    }

    console.log('\nAll accounts created successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error creating accounts:', err);
    process.exit(1);
  }
}

createAccounts();
