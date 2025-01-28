const { Comment, Blog, user } = require('../models');

// Create a new comment
const createComment = async (req, res) => {
  const { blogID } = req.params;
  const { content } = req.body;

  try {
    const blog = await Blog.findByPk(blogID);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const newComment = await Comment.create({
      userID: req.user.userID,
      blogID,
      content,
    });

    res.status(201).json({ message: 'Comment created successfully', commentID: newComment.commentID });
  } catch (err) {
    res.status(500).json({ error: 'Error creating comment', details: err.message });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  const { commentID } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByPk(commentID);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userID !== req.user.userID) {
      return res.status(403).json({ error: 'Unauthorized to edit this comment' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error editing comment', details: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentID } = req.params;

  try {
    const comment = await Comment.findByPk(commentID);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userID !== req.user.userID) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment', details: err.message });
  }
};

module.exports = {
  createComment,
  editComment,
  deleteComment,
};
