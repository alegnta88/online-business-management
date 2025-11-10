import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import customerAuth from '../middleware/customerAuth.js';

const orderRouter = express.Router();

orderRouter.post('/create', customerAuth, createOrder);
orderRouter.get('/my-orders', customerAuth, getMyOrders);
orderRouter.get('/', adminAuth, getAllOrders); 
orderRouter.put('/:id/status', adminAuth, updateOrderStatus);

export default orderRouter;