// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models');

// Register a new user
const register = async (req, res) => {
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
const login = async (req, res) => {
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

// Get the profile of the logged-in user
const getProfile = async (req, res) => {
  try {
    const user = req.user; // user is attached to the request object by the JWT middleware
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update the profile of the logged-in user
const updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  const userId = req.user.id;

  try {
    const user = await user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    
    await user.save(); // Save the updated user

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
