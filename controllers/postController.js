const Post = require('../models/Post.model');
const Response = require('../models/Response.model');

const createPost = async (req, res, next) => {
  try {
    const post = new Post({ ...req.body, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

const listPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('author', 'username name');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// Create response to a post
const createResponse = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const response = new Response({
      content: req.body.content,
      author: req.user._id,
      post: postId
    });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  listPosts,
  createResponse
};
