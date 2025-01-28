// controllers/searchController.js
const { User, Blog } = require('../models');
const { Op } = require('sequelize');

// Search for users by username or name
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;  // The search query
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search for users by username or name (case-insensitive)
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for blogs by title, content, or tags
exports.searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;  // The search query
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search for blogs by title, content, or tags (case-insensitive)
    const blogs = await Blog.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
          // Add more search fields (like tags) here if needed
        ]
      }
    });

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found' });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
