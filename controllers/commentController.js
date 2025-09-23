const Post = require('../models/Post.model');

// Añadir comentario
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId.toString()
    );
    await post.save();

    res.status(200).json({ message: 'Comment deleted', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addComment, deleteComment };
