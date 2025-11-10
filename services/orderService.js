import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';
import mongoose from 'mongoose';
import { sendSMS } from '../utils/sendSMS.js';
import CustomerModel from '../models/customerModel.js';

// new order service
export const createOrderService = async (customer, items, shippingAddress) => {
  if (!items || items.length === 0) throw new Error("No items in the order");

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error(`Invalid product ID ${item.product}`);
    }

    const product = await ProductModel.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);

    const quantity = item.quantity || 1;
    totalAmount += product.price * quantity;

    orderItems.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  const order = new OrderModel({
    customer: customer._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: "pending", 
    orderStatus: "pending",  
  });

  await order.save();

  return order; 
};

// let customer view their orders
export const getOrdersByCustomerService = async (customerId) => {
  return await OrderModel.find({ customer: customerId }).populate('items.product');
};

export const getAllOrdersService = async () => {
  return await OrderModel.find()
    .populate('customer', 'name email')
    .populate('items.product');
};

export const updateOrderStatusService = async (user, orderId, newStatus) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error('Order not found');

  if (user.role !== 'admin' && order.customer.toString() !== user.id) {
    throw new Error('You cannot update this order.');
  }

  const allowedTransitions = {
    pending: ['processing'],
    processing: ['shipped'],
    shipped: [],
    delivered: [],
    cancelled: [],
  };

  const validStatuses = Object.keys(allowedTransitions);
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  if (user.role !== 'admin') {
    if (!allowedTransitions[order.orderStatus].includes(newStatus)) {
      throw new Error(`You cannot change status from ${order.orderStatus} to ${newStatus}`);
    }
  }

  order.orderStatus = newStatus;
  await order.save();

  const customer = await CustomerModel.findById(order.customer);
  if (customer?.phone) {
    const smsSent = await sendSMS(customer.phone, `Your order status has been updated to: ${newStatus}`);
    if (!smsSent) console.warn(`Failed to send SMS to ${customer.phone}`);
  }

  return order;
};
