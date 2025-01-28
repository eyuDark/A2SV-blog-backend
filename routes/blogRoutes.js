// routes/blogRoutes.js

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateJWT = require('../middleware/authenticateJWT'); // Middleware for JWT authentication

// Blog Routes
router.post('/blogs', authenticateJWT, blogController.createBlog); // Create a new blog post
router.get('/blogs', blogController.getAllBlogs); // Get all blog posts
router.get('/blogs/:id', blogController.getBlogById); // Get a single blog by ID
router.put('/blogs/:id', authenticateJWT, blogController.updateBlog); // Update a blog post
router.delete('/blogs/:id', authenticateJWT, blogController.deleteBlog); // Delete a blog post

// Blog Rating Routes
router.post('/blogs/:id/rating', authenticateJWT, blogController.createOrUpdateRating); // Rate a blog

// Blog Comment Routes
router.post('/blogs/:id/comments', authenticateJWT, blogController.createComment); // Create a new comment
router.put('/comments/:id', authenticateJWT, blogController.updateComment); // Update a comment
router.delete('/comments/:id', authenticateJWT, blogController.deleteComment); // Delete a comment

// Blog Like Routes
router.post('/blogs/:id/likes', authenticateJWT, blogController.toggleLike); // Like/Unlike a blog post

module.exports = router;
