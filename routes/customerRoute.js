import express from 'express';
import { registerCustomer, verifyOTP, loginCustomer, getAllCustomers } from '../controllers/customerController.js';
import adminAuth from '../middleware/adminAuth.js';
import { activateCustomerById, deactivateCustomerById } from '../services/customerService.js';

const customerRouter = express.Router();

customerRouter.post('/register', registerCustomer);
customerRouter.post('/verify', verifyOTP);
customerRouter.post('/login', loginCustomer);

customerRouter.get('/', adminAuth, getAllCustomers);

customerRouter.put('/:id/activate', adminAuth, activateCustomerById);
customerRouter.put('/:id/deactivate', adminAuth, deactivateCustomerById);

export default customerRouter;