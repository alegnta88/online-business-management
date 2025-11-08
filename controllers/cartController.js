import { addItemToCart, getCartForCustomer, removeItemFromCart, clearCustomerCartService, } from '../services/cartService.js';

export const addToCart = async (req, res) => {
  try {
    const cart = await addItemToCart(req.user.id, req.body.productId, req.body.quantity);
    res.json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCartItems = async (req, res) => {
  const cart = await getCartForCustomer(req.user.id);
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await removeItemFromCart(req.user.id, req.params.productId);
    res.json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const clearCustomerCart = async (req, res) => {
  await clearCustomerCartService(req.user.id);
  res.json({ success: true, message: 'Cart cleared' });
};