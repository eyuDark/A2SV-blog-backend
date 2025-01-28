// controllers/blogController.js

const { Blog, BlogRating, Comment, Like, user } = require('../models');

// Create a new blog post
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Get user ID from JWT payload

  try {
    const newBlog = await Blog.create({
      title,
      content,
      userId
    });

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id, {
      include: [user, { model: Comment, include: [user] }]
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

// Update a blog post
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id; // Logged-in user ID

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Logged-in user ID

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.destroy();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

// Create or Update blog rating
const createOrUpdateRating = async (req, res) => {
  const { id } = req.params;  // Blog ID
  const { ratingValue } = req.body; // Rating value (1-5)
  const userId = req.user.id;  // Logged-in user ID

  if (ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existingRating = await BlogRating.findOne({
      where: { blogId: id, userId }
    });

    if (existingRating) {
      existingRating.ratingValue = ratingValue;
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
    }

    const newRating = await BlogRating.create({
      blogId: id,
      userId,
      ratingValue
    });

    return res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (error) {
    res.status(500).json({ message: 'Error rating blog', error: error.message });
  }
};

// Create a comment
const createComment = async (req, res) => {
  const { id } = req.params;  // Blog ID
  const { content } = req.body;  // Comment content
  const userId = req.user.id;  // Logged-in user ID

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = await Comment.create({
      blogId: id,
      userId,
      content
    });

    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params; // Comment ID
  const { content } = req.body; // New content
  const userId = req.user.id;  // Logged-in user ID

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;  // Comment ID
  const userId = req.user.id;  // Logged-in user ID

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// Like or Unlike a blog post
const toggleLike = async (req, res) => {
  const { id } = req.params;  // Blog ID
  const userId = req.user.id;  // Logged-in user ID

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existingLike = await Like.findOne({
      where: { blogId: id, userId }
    });

    if (existingLike) {
      // If the user already liked the post, unlike it
      await existingLike.destroy();
      return res.status(200).json({ message: 'Blog unliked' });
    }

    // If the user hasn’t liked the post, like it
    const newLike = await Like.create({
      blogId: id,
      userId
    });

    res.status(201).json({ message: 'Blog liked successfully', like: newLike });
  } catch (error) {
    res.status(500).json({ message: 'Error liking/unliking blog', error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  createOrUpdateRating,
  createComment,
  updateComment,
  deleteComment,
  toggleLike
};
