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

const userRouter = express.Router();

userRouter.post('/register/admin', adminAuth, registerUserByAdmin);
userRouter.post('/login', loginController);
userRouter.get('/', adminAuth, getAllUsers);
userRouter.put('/:id/activate', adminAuth, activateUser);
userRouter.put('/:id/deactivate', adminAuth, deactivateUser);
userRouter.post('/admin/verify', verifyAdminOTPController);

export default userRouter;