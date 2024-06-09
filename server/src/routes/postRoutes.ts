import express from 'express';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';
import  upload from '../middleware/multer';
import { getPosts, createPost, updatePost, deletePost, getPost, likePost, unlikePost } from '../controllers/postController';

const router = express.Router();

router.get('/posts/', authenticateToken, getPosts);
router.get('/posts/:id', authenticateToken, getPost);
router.post('/posts/create', authenticateToken, upload.single('photo'), createPost);
router.put('/posts/:id/update', authenticateToken, updatePost);
router.delete('/posts/:id/delete', authenticateToken, deletePost);
router.put('/posts/:id/like', authenticateToken, likePost);
router.put('/posts/:id/unlike', authenticateToken, unlikePost);

export default router;
