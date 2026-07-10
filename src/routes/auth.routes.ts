import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

export default router;