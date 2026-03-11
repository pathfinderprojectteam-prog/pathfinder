const User = require('../models/User');
const Student = require('../models/Student');
const Client = require('../models/Client');
const Company = require('../models/Company');
const University = require('../models/University');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, ...otherDetails } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let user;

    switch (role) {
      case 'student':
        user = await Student.create({ name, email, password, role, ...otherDetails });
        break;
      case 'client':
        user = await Client.create({ name, email, password, role, ...otherDetails });
        break;
      case 'company':
        user = await Company.create({ name, email, password, role, ...otherDetails });
        break;
      case 'university':
        user = await University.create({ name, email, password, role, ...otherDetails });
        break;
      case 'admin':
        user = await Admin.create({ name, email, password, role, ...otherDetails });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
