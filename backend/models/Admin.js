const mongoose = require('mongoose');
const User = require('./User'); // Base model

const adminSchema = new mongoose.Schema({
  adminLevel: {
    type: String,
  },
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = Admin;
