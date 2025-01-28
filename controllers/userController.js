// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register a new user
const register = async (req, res) => {
  const { username, email, password, name, bio } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      bio,
      role: 'user', // Default role
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user and generate a JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
