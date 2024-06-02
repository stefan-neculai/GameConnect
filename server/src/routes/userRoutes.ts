import express from 'express';
import { signUp, login, getUserById, updateUser, addGameToFavorites } from '../controllers/userController';
import authenticateToken from '../middleware/auth';


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/users', authenticateToken);
router.get('/user/:id', authenticateToken, getUserById);
router.put('/user/update/:id', authenticateToken, updateUser);
router.put('/user/favorite/:id', authenticateToken, addGameToFavorites);

export default router;
