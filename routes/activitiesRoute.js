const express = require("express");
const router = express.Router();

const Like = require("../models/Like.model");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");

/**
 * GET /api/users/:id/activities
 */
router.get("/users/:id/activities", async (req, res) => {
  try {
    const userId = req.params.id;

    // 1) Busca likes hechos por este usuario
    const likes = await Like.find({ user: userId })
      .populate("post", "title coverUrl")
      .lean();

    // 2) Busca comments hechos por este usuario
    const comments = await Comment.find({ author: userId })
      .populate("post", "title coverUrl")
      .lean();

    // 3) Busca posts publicados por este usuario
    const posts = await Post.find({ author: userId })
      .select("title coverUrl createdAt")
      .lean();

    // 4) Normaliza todo en un único array
    const activities = [];

    for (const lk of likes) {
      activities.push({
        type: "like",
        createdAt: lk.createdAt,
        post: lk.post
          ? { id: lk.post._id, title: lk.post.title, coverUrl: lk.post.coverUrl }
          : null,
      });
    }

    for (const cm of comments) {
      activities.push({
        type: "comment",
        createdAt: cm.createdAt,
        comment: { id: cm._id, text: cm.text },
        post: cm.post
          ? { id: cm.post._id, title: cm.post.title, coverUrl: cm.post.coverUrl }
          : null,
      });
    }

    for (const po of posts) {
      activities.push({
        type: "post",
        createdAt: po.createdAt,
        post: { id: po._id, title: po.title, coverUrl: po.coverUrl },
      });
    }

    // 5) Ordena por fecha desc
    activities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar atividades" });
  }
});

module.exports = router;
