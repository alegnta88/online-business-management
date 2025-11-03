import express from 'express';
import { registerUser, verifyOTP, loginUser, adminLogin, getAllUsers } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';


const userRouter = express.Router();


userRouter.post('/register', adminAuth, registerUser);
userRouter.post('/verify', verifyOTP);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin)

userRouter.get('/', adminAuth, getAllUsers);

export default userRouter;