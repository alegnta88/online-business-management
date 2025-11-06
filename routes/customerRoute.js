import express from 'express';
import { registerCustomer, verifyOTP, loginCustomer } from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.post('/register', registerCustomer);
customerRouter.post('/verify', verifyOTP);
customerRouter.post('/login', loginCustomer);

export default customerRouter;