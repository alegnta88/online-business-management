import mongoose from 'mongoose';
import { createOrderService, getOrdersByCustomerService, getAllOrdersService, updateOrderStatusService } from '../services/orderService.js';

export const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const order = await createOrderService(customerId, req.body.items, req.body.shippingAddress);

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getOrdersByCustomerService(req.user._id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};