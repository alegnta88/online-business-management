import {
  registerUserService,
  verifyOTPService,
  loginUserService
} from '../services/userService.js';
import UserModel from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      message: 'User registered successfully. OTP sent.',
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { token, user } = await verifyOTPService(req.body);
    res.json({
      message: 'OTP verified successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { token, user } = await loginUserService(req.body);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken({ role: 'admin', email });
      return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (_, res) => {
  try {
    const users = await UserModel.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};