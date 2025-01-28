// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search Routes
router.get('/search/users', searchController.searchusers);  // Search users
router.get('/search/blogs', searchController.searchBlogs);  // Search blogs

module.exports = router;
