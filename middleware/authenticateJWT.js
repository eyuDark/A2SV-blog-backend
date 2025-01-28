// middleware/authenticateJWT.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    try {
      // Fetch the user from the database based on the decoded token (user info)
      const foundUser = await User.findByPk(user.id);
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = foundUser; // Attach user data to the request object
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      return res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
  });
};

module.exports = authenticateJWT;
