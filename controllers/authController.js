// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register a new user
const registerUser = async (req, res) => { // Fixed: registerUser (camelCase)
  const { username, email, password, name, bio } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } }); // "User"
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      bio,
      role: 'user',
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser }); // Capitalized "User"
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => { // Fixed: loginUser (camelCase)
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } }); // "User"
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password); // "user.password"
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Export with consistent naming
module.exports = { registerUser, loginUser };