import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import customerAuth from '../middleware/customerAuth.js';
import adminOrUserAuth from '../middleware/adminOrUserAuth.js';

const orderRouter = express.Router();

orderRouter.post('/', customerAuth, createOrder);
orderRouter.get('/my-orders', customerAuth, getMyOrders);
orderRouter.get('/', adminAuth, getAllOrders); 
orderRouter.put('/:id/status', adminOrUserAuth, updateOrderStatus);

export default orderRouter;