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

const Company = User.discriminator('Company', companySchema);

module.exports = Company;
