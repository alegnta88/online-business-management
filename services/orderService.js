import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';
import mongoose from 'mongoose';
import { sendSMS } from '../utils/sendSMS.js';

export const createOrderService = async (customer, items, shippingAddress) => {
  if (!items || items.length === 0) throw new Error('No items in the order');

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error(`Invalid product ID ${item.product}`);
    }

    // Fetch product from DB
    const product = await ProductModel.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);

    const price = product.price;
    const quantity = item.quantity || 1;

    totalAmount += price * quantity;

    orderItems.push({
      product: product._id,
      quantity,
      price
    });
  }

  const order = new OrderModel({
    customer: customer._id,
    items: orderItems,
    totalAmount,
    shippingAddress
  });

  await order.save();

  const message = `Dear ${customer.name}, your order has been placed successfully. Your Total Price is: $${order.totalAmount}`;
  const smsSent = await sendSMS(customer.phone, message);
  if (!smsSent) console.warn(`Failed to send SMS to ${customer.phone}`);

  return order;
}

export const getOrdersByCustomerService = async (customerId) => {
  return await OrderModel.find({ customer: customerId }).populate('items.product');
};

export const getAllOrdersService = async () => {
  return await OrderModel.find()
    .populate('customer', 'name email')
    .populate('items.product');
};

export const updateOrderStatusService = async (id, status) => {
  const order = await OrderModel.findById(id);
  if (!order) throw new Error('Order not found');
  order.orderStatus = status;
  await order.save();
  return order;
};