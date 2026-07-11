import express from 'express';
import {
  getPosts, getPost, createPost, deletePost,
  createAnswer, acceptAnswer, deleteAnswer,
} from '../controllers/qa.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', verifyToken, createPost);
router.delete('/:id', verifyToken, deletePost);
router.post('/:id/answers', verifyToken, createAnswer);
router.patch('/:id/answers/:answerId/accept', verifyToken, acceptAnswer);
router.delete('/:id/answers/:answerId', verifyToken, deleteAnswer);

export default router;