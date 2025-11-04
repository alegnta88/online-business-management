import { registerUserService, verifyOTPService, loginUserService } from '../services/userService.js';
import UserModel from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';

// Register a user or customer
export const registerUser = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    const user = await registerUserService(req.body, isAdmin);

    res.status(201).json({
      message: isAdmin ? 'User created successfully by admin' : 'Customer registered successfully. OTP sent.',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { user, token } = await verifyOTPService(req.body);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login for user/customer
export const loginUser = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken({ role: 'admin', email });
      return res.json({
        success: true,
        message: 'Admin login successful',
        token
      });
    }

    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;
    const roleFilter = req.query.role; 

    const query = cursor ? { _id: { $gt: cursor } } : {};
    if (roleFilter) query.role = roleFilter;

    const users = await UserModel.find(query)
      .select('-password')
      .sort({ _id: 1 })
      .limit(limit);

    const nextCursor = users.length ? users[users.length - 1]._id : null;

    res.json({
      success: true,
      users,
      nextCursor
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer self-registration
export const registerCustomer = async (req, res) => {
  try {
    const user = await registerUserService(req.body); 
    res.status(201).json({
      message: 'Customer registered successfully. OTP sent.',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin creates a new user
export const registerUserByAdmin = async (req, res) => {
  try {
    const user = await registerUserService(req.body, true);
    res.status(201).json({
      message: 'User registered successfully by admin.',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
