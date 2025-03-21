import express from 'express';
import { signUp, login, getUserById, updateUser, addGameToFavorites, followUser, getFollowers, getFollowing, getContacts, unfollowUser, removeGameFromFavorites, logout, auth } from '../controllers/userController';
import authenticateToken from '../middleware/auth';
import upload from '../middleware/multer';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/auth', authenticateToken, auth);
router.get('/user/contacts', authenticateToken, getContacts);
router.put('/user/update/:id', authenticateToken, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'banner', maxCount: 1 }]), updateUser);
router.put('/user/favorite/:id', authenticateToken, addGameToFavorites);
router.put('/user/unfavorite/:id', authenticateToken, removeGameFromFavorites);
router.put('/user/follow/:id', authenticateToken, followUser);
router.put('/user/unfollow/:id', authenticateToken, unfollowUser);
router.get('/user/followers/:id', authenticateToken, getFollowers);
router.get('/user/following/:id', authenticateToken, getFollowing);
router.get('/user/:id', authenticateToken, getUserById);
export default router;
