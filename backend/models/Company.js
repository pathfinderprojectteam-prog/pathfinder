const mongoose = require('mongoose');
const User = require('./User'); // Base model

const companySchema = new mongoose.Schema({
  industry: {
    type: String,
  },
  companySize: {
    type: Number,
  },
});

const Company = User.discriminator('company', companySchema);

module.exports = Company;
