// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController'); // Ensure this points to the correct controller file
const authenticateJWT = require('../middleware/authenticateJWT');

// user Authentication Routes
router.post('/auth/register', userController.registeruser); // Register new user
router.post('/auth/login', userController.loginuser); // Log in an existing user
router.get('/auth/profile', authenticateJWT, userController.getProfile); // Get user profile (Authenticated route)
router.put('/auth/profile', authenticateJWT, userController.updateProfile); // Update user profile (Authenticated route)

module.exports = router;
