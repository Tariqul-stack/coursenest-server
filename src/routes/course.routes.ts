import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleStatus,
  getMyCourses,
} from '../controllers/course.controller';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getCourses);
router.get('/my-courses', verifyToken, authorizeRoles('teacher', 'admin'), getMyCourses);
router.get('/:id', getCourse);
router.post('/', verifyToken, authorizeRoles('teacher', 'admin'), createCourse);
router.put('/:id', verifyToken, authorizeRoles('teacher', 'admin'), updateCourse);
router.delete('/:id', verifyToken, authorizeRoles('teacher', 'admin'), deleteCourse);
router.patch('/:id/status', verifyToken, authorizeRoles('teacher', 'admin'), toggleStatus);

export default router;