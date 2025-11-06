import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/my-orders', userAuth, getMyOrders);
orderRouter.get('/', adminAuth, getAllOrders); 
orderRouter.put('/:id/status', adminAuth, updateOrderStatus); 
export default orderRouter;