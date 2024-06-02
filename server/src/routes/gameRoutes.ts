import express from 'express';
import { getGameById, getGames, getFavoriteGames, getSimilarGames } from '../controllers/gameController';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';


const router = express.Router();

router.get('/games', authenticateToken, getGames);
router.get('/game/:id', authenticateToken, getGameById);
router.get('/games/favorite/:id', authenticateToken, getFavoriteGames);
router.get('/games/similar/:id', authenticateToken, getSimilarGames);
export default router;
