import { getCart, saveCart, clearCart } from '../utils/cart.js';
import CustomerModel from '../models/customerModel.js';
import ProductModel from '../models/productModel.js';

export const addItemToCart = async (customerId, productId, quantity) => {
  const product = await ProductModel.findById(productId);
  if (!product) throw new Error('Product not found');

  const cart = await getCart(customerId);
  const existingItem = cart.items.find(i => i.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.price });
  }

  cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  await saveCart(customerId, cart);
  return cart;
};

export const getCartForCustomer = async (customerId) => {
  return await getCart(customerId);
};

export const removeItemFromCart = async (customerId, productId) => {
  const cart = await getCart(customerId);
  cart.items = cart.items.filter(item => item.productId !== productId);
  cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  await saveCart(customerId, cart);
  return cart;
};

export const clearCustomerCartService = async (customerId) => {
  await clearCart(customerId);
};

export const persistCartToMongoService = async (customerId) => {
  const cart = await getCart(customerId);
  await CustomerModel.findByIdAndUpdate(customerId, { cartData: cart });
  await clearCart(customerId);
};