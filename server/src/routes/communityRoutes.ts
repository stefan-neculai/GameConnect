import express from 'express';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';
import { createCommunity, getCommunities, getCommunityById } from '../controllers/communityController';
import  upload from '../middleware/multer';

const router = express.Router();

router.get('/community/', authenticateToken, getCommunities);
router.get('/community/:id', authenticateToken, getCommunityById);
router.post('/community/create', authenticateToken, upload.single('communityIcon'), createCommunity);
//router.post('/community/:id/post', authenticateToken, createPost);
// router.get('/community/:id/posts', authenticateToken, getPostsByCommunityId);
//router.put('/community/:id/update', authenticateToken, updateCommunity);
//router.put('/community/:id/follow', authenticateToken, followCommunity);
//router.put('/community/:id/unfollow', authenticateToken, unfollowCommunity);
//router.put('/community/:id/post/:postId', authenticateToken, updatePost);

export default router;
