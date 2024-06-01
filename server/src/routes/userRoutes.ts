import express from 'express';
import { signUp, login, getUserById, updateUser } from '../controllers/userController';
import authenticateToken from '../middleware/auth';


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/users', authenticateToken);
router.get('/user/:id', getUserById);
router.put('/user/update/:id', updateUser);

export default router;
