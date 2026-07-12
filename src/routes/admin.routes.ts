import express from 'express';
import {
  getAllUsers,
  changeUserRole,
  deleteUser,
} from '../controllers/admin.controller';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.use(verifyToken, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

export default router;