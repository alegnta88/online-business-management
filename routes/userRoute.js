import express from 'express';
import { 
  registerUserByAdmin, 
  verifyAdminOTPController, 
  loginController, 
  getAllUsers, 
  activateUser, 
  deactivateUser 
} from '../controllers/userController.js';

import adminAuth from '../middleware/adminAuth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import adminOrUserAuth from '../middleware/adminOrUserAuth.js';
const userRouter = express.Router();

userRouter.post('/register/admin', adminAuth, registerUserByAdmin);
userRouter.post('/login', loginController);
userRouter.get('/', adminOrUserAuth, requirePermission('CAN_VIEW_USERS'), getAllUsers);
userRouter.put('/:id/activate', adminAuth, activateUser);
userRouter.put('/:id/deactivate', adminAuth, deactivateUser);
userRouter.post('/admin/verify', verifyAdminOTPController);

export default userRouter;