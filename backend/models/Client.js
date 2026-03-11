const mongoose = require('mongoose');
const User = require('./User'); // Base model

const clientSchema = new mongoose.Schema({
  organizationName: {
    type: String,
  },
  clientType: {
    type: String,
  },
});

const Client = User.discriminator('client', clientSchema);

module.exports = Client;
