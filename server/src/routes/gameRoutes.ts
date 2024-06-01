import express from 'express';
import { getGameById, getGames } from '../controllers/gameController';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';


const router = express.Router();

router.get('/games', authenticateToken, getGames);
router.get('/game/:id', authenticateToken, getGameById);
export default router;
