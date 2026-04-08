require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGODB_URI ? 'HIDDEN' : 'MISSING');

const test = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Fast fail
    });
    console.log('SUCCESS: MongoDB connected to ' + conn.connection.host);
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: ' + err.message);
    if (err.message.includes('whitelist')) {
      console.log('HINT: Your IP address likely needs to be added to the MongoDB Atlas whitelist.');
    }
    process.exit(1);
  }
};

test();
