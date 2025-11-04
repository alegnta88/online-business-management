import express from 'express';
import { 
  registerCustomer, 
  registerUserByAdmin, 
  verifyOTP, 
  loginUser, 
  adminLogin, 
  getAllUsers 
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

// Customer self-registration
userRouter.post('/register', registerCustomer);

// Admin registration
userRouter.post('/register/admin', adminAuth, registerUserByAdmin);

// Other routes
userRouter.post('/verify', verifyOTP);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/', adminAuth, getAllUsers);

export default userRouter;