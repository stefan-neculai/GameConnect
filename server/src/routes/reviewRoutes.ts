import express from 'express';
import { signUp, login, getUserById, updateUser } from '../controllers/userController';
import authenticateToken from '../middleware/auth';
import { createReview, getReviewsByGameId, getReviewsByUserId, updateReview } from '../controllers/reviewController';


const router = express.Router();

router.get('/reviews/game/:id', authenticateToken, getReviewsByGameId);
router.get('/reviews/user/:id', authenticateToken, getReviewsByUserId);
router.post('/review/create', authenticateToken, createReview);
router.put('/review/update/:id', authenticateToken, updateReview);

export default router;
