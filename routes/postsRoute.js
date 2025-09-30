const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");
const Post = require("../models/Post.model.js");
const {
  createPost,
  listPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  listComments,
} = require("../controllers/postController");

// Posts
router.get("/", listPosts);
router.post("/", isAuth, createPost);
router.put("/:id", isAuth, isOwner(Post, "author", "id"), updatePost);
router.delete("/:id", isAuth, isOwner(Post, "author", "id"), deletePost);

// Likes
router.post("/:postId/like", isAuth, toggleLike);

// Comments
router.post("/:postId/comments", isAuth, addComment);
router.delete("/:postId/comments/:commentId", isAuth, isOwner(Post, "author", "id"), deleteComment);
router.get("/:postId/comments", isAuth, listComments);

module.exports = router;
