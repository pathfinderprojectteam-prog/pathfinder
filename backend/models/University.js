const mongoose = require('mongoose');
const User = require('./User'); // Base model

const universitySchema = new mongoose.Schema({
  accreditation: {
    type: String,
  },
  country: {
    type: String,
  },
});

const University = User.discriminator('University', universitySchema);

module.exports = University;
