const mongoose = require('mongoose');
const User = require('./User'); // Base model

const studentSchema = new mongoose.Schema(
  {
    profileCompletion: {
      type: Number,
      default: 0,
    },
    recommendedPath: {
      type: String,
      enum: ['employment', 'freelance', 'studies', 'hybrid'],
    },
    chosenPath: {
      type: String,
      enum: ['employment', 'freelance', 'studies', 'hybrid'],
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
  },
  // We use discriminator options
  // Mongoose discriminators let us inherit from another schema.
  // We don't need timestamps here because the base User schema already has them.
  // Mongoose automatically adds the discriminator fields.
);

// We define the discriminator on the base User model, passing a name ('Student') and the schema.
const Student = User.discriminator('student', studentSchema);

module.exports = Student;
