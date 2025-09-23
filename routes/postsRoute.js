const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const isOwner = require('../middlewares/isOwner');

const { 
    createPost, 
    updatePost, 
    deletePost, 
    listPosts, 
    createResponse 
} = require('../controllers/postController');

const { addLike, removeLike } = require('../controllers/likeController');
const { addComment, deleteComment } = require('../controllers/commentController');

const Post = require('../models/Post.model');

router.get('/', listPosts);
router.post('/', isAuth, createPost);
router.put('/:id', isAuth, isOwner(Post, 'author', 'id'), updatePost);
router.delete('/:id', isAuth, isOwner(Post, 'author', 'id'), deletePost);
router.post('/:postId/responses', isAuth, createResponse);

router.post('/:postId/like', isAuth, addLike);     
router.delete('/:postId/like', isAuth, removeLike);

router.post('/:postId/comment', isAuth, addComment); 
router.delete('/:postId/comment/:commentId', isAuth, deleteComment);  


module.exports = router;
