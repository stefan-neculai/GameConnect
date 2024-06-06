import express from 'express';
import { signUp, login, getUserById, updateUser, addGameToFavorites, followUser, getFollowers, getFollowing } from '../controllers/userController';
import authenticateToken from '../middleware/auth';

const multer = require('multer');
const path = require('path');
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req : any, file : any, cb : any) {
    cb(null, 'images/'); // Directory to save the uploaded files
  },
  filename: function (req : any, file : any, cb : any) {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/users', authenticateToken);
router.get('/user/:id', authenticateToken, getUserById);
router.put('/user/update/:id', authenticateToken, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'banner', maxCount: 1 }]), updateUser);
router.put('/user/favorite/:id', authenticateToken, addGameToFavorites);
router.put('/user/follow/:id', authenticateToken, followUser);
router.put('/user/unfollow/:id', authenticateToken, followUser);
router.get('/user/followers/:id', authenticateToken, getFollowers);
router.get('/user/following/:id', authenticateToken, getFollowing);

export default router;
