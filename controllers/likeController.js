const { Like, Blog, User } = require('../models');

// Like a blog post
const likeBlog = async (req, res) => {
  const { blogID } = req.params;

  try {
    const blog = await Blog.findByPk(blogID);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingLike = await Like.findOne({
      where: { userID: req.user.userID, blogID },
    });

    if (existingLike) {
      return res.status(400).json({ error: 'You already liked this blog' });
    }

    await Like.create({
      userID: req.user.userID,
      blogID,
    });

    res.status(201).json({ message: 'Blog liked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error liking blog', details: err.message });
  }
};

// Unlike a blog post
const unlikeBlog = async (req, res) => {
  const { blogID } = req.params;

  try {
    const blog = await Blog.findByPk(blogID);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingLike = await Like.findOne({
      where: { userID: req.user.userID, blogID },
    });

    if (!existingLike) {
      return res.status(400).json({ error: 'You have not liked this blog' });
    }

    await existingLike.destroy();

    res.status(200).json({ message: 'Blog unliked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error unliking blog', details: err.message });
  }
};

module.exports = {
  likeBlog,
  unlikeBlog,
};
