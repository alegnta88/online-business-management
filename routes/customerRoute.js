import express from 'express';
import { registerCustomer, verifyOTP, loginCustomer, getAllCustomers, deactivateCustomer, activateCustomer } from '../controllers/customerController.js';
import adminAuth from '../middleware/adminAuth.js';

const customerRouter = express.Router();

customerRouter.post('/register', registerCustomer);
customerRouter.post('/verify', verifyOTP);
customerRouter.post('/login', loginCustomer);

customerRouter.get('/all', adminAuth, getAllCustomers);
customerRouter.put('/:id/deactivate', adminAuth, deactivateCustomer);
customerRouter.put('/:id/activate', adminAuth, activateCustomer);

export default customerRouter;