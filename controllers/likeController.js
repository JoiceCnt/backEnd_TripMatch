const Post = require('../models/Post.model');

// Dar like
const addLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({ message: 'Post liked', likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Quitar like
const removeLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await post.save();

    res.status(200).json({ message: 'Like removed', likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addLike, removeLike };
