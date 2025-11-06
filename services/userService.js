import UserModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// Register a new user (admin only)
export const registerUserService = async ({ name, email, phone, password }, isAdmin = false) => {
  if (!isAdmin) throw new Error('Only admin can create users');

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await hashPassword(password);

  const user = new UserModel({
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'user',
    isVerified: true,
  });

  await user.save();
  return user;
};

// Login for users
export const loginUserService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.role !== 'user') throw new Error('Access denied. Not a user');
  if (!user.isVerified) throw new Error('Please verify your account first');
  if (!user.isActive) throw new Error('Your account has been deactivated. Contact support.');

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({ id: user._id, email: user.email, role: user.role });
  return { user, token };
};

// Deactivate a user
export const deactivateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');
  if (user.role !== 'user') throw new Error('Cannot deactivate non-user account');

  user.isActive = false;
  await user.save();
  return user;
};

// Activate a user
export const activateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');
  if (user.role !== 'user') throw new Error('Cannot activate non-user account');

  user.isActive = true;
  await user.save();
  return user;
};