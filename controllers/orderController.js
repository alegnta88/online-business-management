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
    const user = req.user;
    const orderId = req.params.id;
    const newStatus = req.body.status;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If user is not admin, ensure they own the order
    if (user.role !== 'admin' && order.customer.toString() !== user.id) {
      return res.status(403).json({ success: false, message: 'You cannot update this order.' });
    }

    // Allowed status transitions for customers
    const allowedTransitions = {
      pending: ['processing'],
      processing: ['shipped'],
      shipped: [],
      delivered: [],
      cancelled: [],
    };

    if (user.role !== 'admin') {
      if (!allowedTransitions[order.orderStatus].includes(newStatus)) {
        return res.status(400).json({ 
          success: false, 
          message: `You cannot change status from ${order.orderStatus} to ${newStatus}` 
        });
      }
    }

    // Update the order status
    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};