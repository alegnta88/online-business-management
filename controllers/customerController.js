import CustomerModel from '../models/customerModel.js';
import { registerCustomerService, verifyCustomerOTPService, loginCustomerService, getAllCustomersService, activateCustomerService, deactivateCustomerService } from '../services/customerService.js';
import { generateToken } from '../utils/jwt.js';

// new customer registration
export const registerCustomer = async (req, res) => {
  try {
    const customer = await registerCustomerService(req.body);

    res.status(201).json({
      message: 'Customer registered successfully. OTP sent.',
      customerId: customer._id,
      role: 'customer'
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
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

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const { customers, nextCursor } = await getAllCustomersService(limit, cursor);

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

// customer deactivation
export const deactivateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await deactivateCustomerService(id);

    res.status(200).json({
      success: true,
      message: 'Customer deactivated successfully',
      customerId: customer._id
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Activate customer
export const activateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await activateCustomerService(id);

    res.status(200).json({
      success: true,
      message: 'Customer activated successfully',
      customerId: customer._id
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};