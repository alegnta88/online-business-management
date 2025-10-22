import express from 'express';
import { registerUser, loginUser, adminLogin, getAllUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

export default userRouter;