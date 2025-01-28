// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');

// Authentication Routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/auth/profile', authenticateJWT, userController.getProfile);
router.put('/auth/profile', authenticateJWT, userController.updateProfile);

module.exports = router;
