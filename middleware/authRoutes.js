const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const router = express.Router();

// user Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existinguser = await user.findOne({ where: { email } });
    if (existinguser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await user.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'user registered', user: newuser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// user Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await user.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userID: user.userID, username: user.username }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
