import express from 'express';
import { registerCustomer, verifyOTP, loginCustomer, getAllCustomers } from '../controllers/customerController.js';
import adminAuth from '../middleware/adminAuth.js';

const customerRouter = express.Router();

customerRouter.post('/register', registerCustomer);
customerRouter.post('/verify', verifyOTP);
customerRouter.post('/login', loginCustomer);

customerRouter.get('/', adminAuth, getAllCustomers);

export default customerRouter;