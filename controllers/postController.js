const FeedPost = require("../models/Post.model");

// Crear post
const createPost = async (req, res) => {
  try {
    const { title, comment, author } = req.body;
    const post = new FeedPost({
      title: title || "Untitled",
      comment: comment || "",
      author,
      likes: [],
      comments: [],
      createdAt: new Date(),
    });

    await post.save();

    const postJSON = post.toObject();
    postJSON.id = postJSON._id;
    res.status(201).json(postJSON);
  } catch (err) {
    console.error("❌ ERROR en createPost:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Listar posts
const listPosts = async (_req, res) => {
  try {
    const posts = await FeedPost.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "username name")
      .populate("comments.user", "username name");


    const postsJSON = posts.map((p) => {
      const obj = p.toObject();
      obj.id = obj._id;
      return obj;
    });

    res.json(postsJSON);
  } catch (err) {
    console.error("❌ ERROR en listPosts:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar post
const updatePost = async (req, res) => {
  try {
    const post = await FeedPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const postJSON = post.toObject();
    postJSON.id = postJSON._id;
    res.json(postJSON);
  } catch (err) {
    console.error("❌ ERROR en updatePost:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar post
const deletePost = async (req, res) => {
  try {
    const post = await FeedPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("❌ ERROR en deletePost:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Toggle Like
const toggleLike = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.body.userId; // ⚡ debe venir del frontend
    if (!userId) return res.status(400).json({ error: "userId is required" });

    if (post.likes.includes(userId)) {
      // ya dio like → lo removemos
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // no dio like → lo agregamos
      post.likes.push(userId);
    }

    await post.save();

    const postJSON = post.toObject();
    postJSON.id = postJSON._id;  // para que frontend use post.id
    res.json(postJSON);
  } catch (err) {
    console.error("❌ ERROR en toggleLike:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Comentarios
const addComment = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

   const newComment = {
    text: req.body.text,
    author: { id: req.body.userId, name: req.body.userName, photo: req.body.userPhoto },
    createdAt: new Date().toISOString()
  };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    savedComment.id = savedComment._id;
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("❌ ERROR en addComment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments = post.comments.filter((c) => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("❌ ERROR en deleteComment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const listComments = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.postId).populate("comments.author", "username name");
    if (!post) return res.status(404).json({ error: "Post not found" });
    const commentsJSON = post.comments.map((c) => ({ ...c.toObject(), id: c._id }));
    res.json(commentsJSON);
  } catch (err) {
    console.error("❌ ERROR en listComments:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  listPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  listComments,
};
