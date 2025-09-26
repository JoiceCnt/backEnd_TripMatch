const express = require("express");
const router = express.Router();
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
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

// Likes
router.post("/:postId/like", toggleLike);

// Comments
router.post("/:postId/comments", addComment);
router.delete("/:postId/comments/:commentId", deleteComment);
router.get("/:postId/comments", listComments);

module.exports = router;
