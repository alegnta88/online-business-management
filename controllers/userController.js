import { 
  registerUserService,  
  activateUserById, 
  deactivateUserById,
  createAdminOTP,
  verifyAdminOTP,
  loginUserService
} from '../services/userService.js';
import UserModel from '../models/userModel.js';

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

export const verifyAdminOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const token = await verifyAdminOTP(email, otp);

    res.json({
      success: true,
      message: 'Admin 2FA verified successfully',
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      await createAdminOTP(email, password);
      return res.json({
        success: true,
        message: 'OTP sent to your email. Please verify to complete admin login.'
      });
    }

    const { user, token } = await loginUserService({ email, password });

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    res.json({
      success: true,
      message: `Login successful as ${user.role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};