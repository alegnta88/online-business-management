import {
  registerCustomerService,
  verifyCustomerOTPService,
  loginCustomerService,
  verify2FALoginService,
  enable2FAService,
  verifyEnable2FAService,
  getAllCustomersService,
  activateCustomerService,
  deactivateCustomerService,
} from '../services/customerService.js';

// Register new customer
export const registerCustomer = async (req, res) => {
  try {
    const customer = await registerCustomerService(req.body);
    res.status(201).json({
      message: 'Customer registered successfully. OTP sent.',
      customerId: customer._id,
      role: 'customer',
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Verify registration OTP
export const verifyOTP = async (req, res) => {
  try {
    const { customer, token } = await verifyCustomerOTPService(req.body);
    res.json({
      message: 'OTP verified successfully',
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login customer
export const loginCustomer = async (req, res) => {
  try {
    const result = await loginCustomerService(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify 2FA OTP for login
export const verify2FALogin = async (req, res) => {
  try {
    const { customer, token } = await verify2FALoginService(req.body);
    res.json({
      message: 'Login successful with 2FA',
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const enable2FA = async (req, res) => {
  try {
    const result = await enable2FAService(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify enabling 2FA
export const verifyEnable2FA = async (req, res) => {
  try {
    const result = await verifyEnable2FAService({ customerId: req.user.id, otp: req.body.otp });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const { customers, nextCursor } = await getAllCustomersService(
      parseInt(req.query.limit) || 10,
      req.query.cursor
    );
    res.json({ success: true, customers, nextCursor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deactivateCustomer = async (req, res) => {
  try {
    const customer = await deactivateCustomerService(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Customer deactivated successfully',
      customerId: customer._id,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const activateCustomer = async (req, res) => {
  try {
    const customer = await activateCustomerService(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Customer activated successfully',
      customerId: customer._id,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};