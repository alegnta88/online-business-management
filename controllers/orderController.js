import UserModel from '../models/userModel.js';
import { createOrderService, getOrdersByCustomerService, getAllOrdersService, updateOrderStatusService } from '../services/orderService.js';
import { sendSMS } from '../utils/sendSMS.js';

export const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;

    const customer = await UserModel.findById(customerId);
    if (!customer) throw new Error('Customer not found');

    const order = await createOrderService(customerId, req.body.items, req.body.shippingAddress);

    const message = `Dear ${customer.name}, your order has been placed successfully. Your Total Price is: $${order.totalAmount}`;
    const smsSent = await sendSMS(customer.phone, message);
    if (!smsSent) console.warn(`Failed to send SMS to ${customer.phone}`);

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
    const order = await updateOrderStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};