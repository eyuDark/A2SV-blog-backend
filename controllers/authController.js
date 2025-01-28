// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models');

// Register a new user
const registeruser = async (req, res) => {
  const { username, email, password, name, bio } = req.body;

  try {
    // Check if user already exists
    const existinguser = await user.findOne({ where: { email } });
    if (existinguser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newuser = await user.create({
      username,
      email,
      password: hashedPassword,
      name,
      bio,
      role: 'user', // Default role
    });

    res.status(201).json({ message: 'user registered successfully', user: newuser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user and generate a JWT
const loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await user.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { registeruser, loginuser };
