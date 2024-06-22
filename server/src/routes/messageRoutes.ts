import express from 'express';
import authenticateToken from '../middleware/auth';
import { getMessages, getMessage, sendMessage, updateMessage, deleteMessage } from '../controllers/messageController';

const router = express.Router();

router.get('/messages', authenticateToken, getMessages);
router.get('/messages/:id', authenticateToken, getMessage);
router.post('/messages/send/:id', authenticateToken, sendMessage);
router.put('/messages/:id', authenticateToken, updateMessage);
router.delete('/messages/:id', authenticateToken, deleteMessage);

export default router;
