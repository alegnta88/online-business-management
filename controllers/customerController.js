import CustomerModel from '../models/customerModel.js';
import { registerCustomerService, verifyCustomerOTPService, loginCustomerService } from '../services/customerService.js';
import { generateToken } from '../utils/jwt.js';

// Register a customer
export const registerCustomer = async (req, res) => {
  try {
    const customer = await registerCustomerService(req.body);

    res.status(201).json({
      message: 'Customer registered successfully. OTP sent.',
      customerId: customer._id,
      role: 'customer'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify OTP for customer
export const verifyOTP = async (req, res) => {
  try {
    const { customer, token } = await verifyCustomerOTPService(req.body);

    res.json({
      message: 'OTP verified successfully',
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Customer login
export const loginCustomer = async (req, res) => {
  try {
    const { customer, token } = await loginCustomerService(req.body);

    res.json({
      message: 'Login successful',
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customers (admin only)
export const getAllCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const query = cursor ? { _id: { $gt: cursor } } : {};
    const customers = await CustomerModel.find(query)
      .select('-password')
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor = customers.length ? customers[customers.length - 1]._id : null;

    res.json({
      success: true,
      customers,
      nextCursor
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};