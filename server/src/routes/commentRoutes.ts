import express from 'express';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';
import  upload from '../middleware/multer';
import { createComment, deleteComment, getComment, getComments, likeComment, unlikeComment, updateComment } from '../controllers/commentsControllers';

const router = express.Router();

router.get('/comments/:postId', authenticateToken, getComments);
router.get('/comments/:id', authenticateToken, getComment);
router.post('/comments/create', authenticateToken, createComment);
router.put('/comments/:id/update', authenticateToken, updateComment);
router.delete('/comments/:id/delete', authenticateToken, deleteComment);
router.put('/comments/:id/like', authenticateToken, likeComment);
router.put('/comments/:id/unlike', authenticateToken, unlikeComment);

export default router;