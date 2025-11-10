import UserModel from '../models/userModel.js';
import { createOrderService, getOrdersByCustomerService, getAllOrdersService, updateOrderStatusService } from '../services/orderService.js';
import { sendSMS } from '../utils/sendSMS.js';
import OrderModel from '../models/orderModel.js';
import CustomerModel from '../models/customerModel.js';

export const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;

    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new Error('Customer not found');

    const order = await createOrderService(customer, req.body.items, req.body.shippingAddress);

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
    const orders = await getOrdersByCustomerService(req.user.id);
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
    const { id } = req.params;
    const { status } = req.body;

    if (!id) throw new Error("Order ID is required");
    if (!status) throw new Error("New status is required");

    const order = await updateOrderStatusService(req.user, id, status);

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};