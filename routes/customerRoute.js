import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerCustomer, verifyOTP, loginCustomer, getAllCustomers, deactivateCustomer, activateCustomer } from '../controllers/customerController.js';
import adminAuth from '../middleware/adminAuth.js';

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3, 
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

const customerRouter = express.Router();

customerRouter.post('/register', registerCustomer);
customerRouter.post('/verify', verifyOTP);
customerRouter.post('/login', loginLimiter, loginCustomer);

customerRouter.get('/', adminAuth, getAllCustomers);
customerRouter.put('/:id/deactivate', adminAuth, deactivateCustomer);
customerRouter.put('/:id/activate', adminAuth, activateCustomer);

export default customerRouter;