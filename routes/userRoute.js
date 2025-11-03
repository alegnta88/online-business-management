import express from 'express';
import { registerUser, verifyOTP, loginUser, adminLogin, getAllUsers } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';


const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/verify', verifyOTP);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin)

userRouter.get('/', adminAuth, getAllUsers);

export default userRouter;