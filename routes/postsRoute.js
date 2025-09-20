const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { createPost, updatePost, deletePost, listPosts, createResponse } = require('../controllers/postController');
const Post = require('../models/Post.model');
const isOwner = require('../middlewares/isOwner');

const router = express.Router();

router.get('/', listPosts);
router.post('/', isAuth, createPost);
router.put('/:id', isAuth, isOwner(Post, 'author', 'id'), updatePost);
router.delete('/:id', isAuth, isOwner(Post, 'author', 'id'), deletePost);
router.post('/:postId/responses', isAuth, createResponse);

module.exports = router;
