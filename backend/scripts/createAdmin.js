/**
 * PathFinder Admin Seed Script
 * Creates the initial admin account in MongoDB Atlas
 * Run with: node scripts/createAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const ADMIN_EMAIL = 'admin@pathfinder.com';
const ADMIN_PASSWORD = 'Admin123456';
const ADMIN_NAME = 'PathFinder Admin';

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('ℹ️  Admin account already exists:');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Role:  ${existing.role}`);
      console.log(`   ID:    ${existing._id}`);
      await mongoose.disconnect();
      return;
    }

    // Create the admin — the User model's pre-save hook handles bcrypt hashing
    const admin = await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'Admin',
      adminLevel: 'superadmin',
    });

    console.log('');
    console.log('🎉 Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Pass:  ${ADMIN_PASSWORD}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`   ID:    ${admin._id}`);
    console.log('─────────────────────────────────────');
    console.log('   Dashboard: http://localhost:5174/admin/dashboard');
    console.log('');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
