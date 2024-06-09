import express from 'express';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';
import { createCommunity, getCommunities, getCommunityById, joinCommunity } from '../controllers/communityController';
import  upload from '../middleware/multer';

const router = express.Router();

router.get('/community/', authenticateToken, getCommunities);
router.get('/community/:id', authenticateToken, getCommunityById);
router.post('/community/create', authenticateToken, upload.single('communityIcon'), createCommunity);
router.post('/community/:id/update', authenticateToken, upload.single('communityIcon'), createCommunity);
router.post(`/community/join/:id`, authenticateToken, joinCommunity);

export default router;
