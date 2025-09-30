const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
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
router.put("/:id", isAuth, updatePost);
router.delete("/:id", isAuth, deletePost);

// Likes
router.post("/:postId/like", isAuth, toggleLike);

// Comments
router.post("/:postId/comments", isAuth, addComment);
router.delete("/:postId/comments/:commentId", isAuth, deleteComment);
router.get("/:postId/comments", isAuth, listComments);

module.exports = router;
