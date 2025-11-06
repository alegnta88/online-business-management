import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';

export const createOrderService = async (customerId, items, shippingAddress) => {
  let totalAmount = 0;

  for (const item of items) {
    const product = await ProductModel.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    totalAmount += product.price * item.quantity;
  }

  const order = new OrderModel({
    customer: customerId,
    items,
    totalAmount,
    shippingAddress
  });

  await order.save();
  return order;
};

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