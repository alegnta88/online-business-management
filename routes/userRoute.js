import express from 'express';
import { registerUser, loginUser, adminLogin, getAllUsers } from '../controllers/userController.js';
import rateLimit from 'express-rate-limit';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3, 
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});


// user routes

userRouter.get('/', adminAuth, getAllUsers)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginLimiter, loginUser)
userRouter.post('/admin', adminLogin)

export default userRouter;