const { BlogRating, Blog, user } = require('../models');

// Create or update a rating for a blog
const rateBlog = async (req, res) => {
  const { blogID } = req.params;
  const { ratingValue } = req.body;

  try {
    const blog = await Blog.findByPk(blogID);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingRating = await BlogRating.findOne({
      where: { userID: req.user.userID, blogID },
    });

    if (existingRating) {
      existingRating.ratingValue = ratingValue;
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated successfully' });
    }

    const newRating = await BlogRating.create({
      userID: req.user.userID,
      blogID,
      ratingValue,
    });

    res.status(201).json({ message: 'Rating added successfully', ratingID: newRating.ratingID });
  } catch (err) {
    res.status(500).json({ error: 'Error rating blog', details: err.message });
  }
};

module.exports = {
  rateBlog,
};
