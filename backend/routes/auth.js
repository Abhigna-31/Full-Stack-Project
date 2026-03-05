const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ email }).lean();
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user document
    const newUser = new User({
      name,
      email,
      password,
      role: 'user', // Hardcode to 'user' to prevent privilege escalation
    });

    // Save to MongoDB
    await newUser.save();

    // Verify user was saved by querying MongoDB
    const savedUser = await User.findById(newUser._id).lean();
    if (!savedUser) {
      throw new Error('User was not saved to database');
    }

    console.log(`\n✓ NEW USER REGISTERED AND SAVED TO MONGODB:`);
    console.log(`  Email: ${email}`);
    console.log(`  User ID: ${newUser._id}`);
    console.log(`  Saved to: movie_booking.users\n`);

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('\n✗ REGISTRATION ERROR:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code}\n`);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`✗ Login attempt failed - user not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`✗ Login attempt failed - wrong password: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log(`✓ User logged in: ${email}`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
