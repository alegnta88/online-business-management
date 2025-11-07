import { 
  registerUserService, 
  loginUserService, 
  activateUserById, 
  deactivateUserById,
  createAdminOTP,
  verifyAdminOTP
} from '../services/userService.js';
import UserModel from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';


// Register a new user
export const registerUserByAdmin = async (req, res) => {
  try {
    const user = await registerUserService({ ...req.body, role: 'user' }, true);
    res.status(201).json({
      message: 'User registered successfully by admin.',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users 
export const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const query = { role: 'user' }; 
    if (cursor) query._id = { $gt: cursor };

    const users = await UserModel.find(query)
      .select('-password')
      .sort({ _id: -1 })
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

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    await createAdminOTP(email, password);

    res.json({
      success: true,
      message: 'OTP sent to your email. Verify to complete login.'
    });

  } catch (error) {
    res.status(error.message === 'Invalid admin credentials' ? 401 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin verify OTP
export const adminVerifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const token = verifyAdminOTP(email, otp);

    res.json({
      success: true,
      message: 'Admin login successful',
      token
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Activate a user
export const activateUser = async (req, res) => {
  try {
    const user = await activateUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Deactivate a user
export const deactivateUser = async (req, res) => {
  try {
    const user = await deactivateUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// login for normal users
export const loginUser = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);

    if (user.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Access denied. Not a user.' });
    }

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};