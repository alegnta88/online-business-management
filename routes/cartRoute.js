import express from 'express';
import customerAuth from '../middleware/customerAuth.js';
import { addToCart, getCartItems, removeFromCart, clearCustomerCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', customerAuth, addToCart);
router.get('/', customerAuth, getCartItems);
router.delete('/remove/:productId', customerAuth, removeFromCart);
router.delete('/clear', customerAuth, clearCustomerCart);

export default router;