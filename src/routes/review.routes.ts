import express from 'express';
import {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/review.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.get('/my', verifyToken, getMyReviews);
router.post('/', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;