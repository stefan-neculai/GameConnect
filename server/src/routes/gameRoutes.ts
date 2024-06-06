import express from 'express';
import { getGameById, getGames, getFavoriteGames, getSimilarGames, getAllGenres, getAllGameModes, getAllPlatforms } from '../controllers/gameController';
import authenticateToken from '../middleware/auth';
import { get } from 'mongoose';


const router = express.Router();

router.get('/games', authenticateToken, getGames);
router.get('/game/:id', authenticateToken, getGameById);
router.get('/games/favorite/:id', authenticateToken, getFavoriteGames);
router.get('/games/similar/:id', authenticateToken, getSimilarGames);
router.get('/games/genres', getAllGenres);
router.get('/games/platforms', getAllPlatforms);
router.get('/games/modes', getAllGameModes);
export default router;
