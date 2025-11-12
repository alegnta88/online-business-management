import UserModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendSMS } from '../utils/sendSMS.js';
import redisClient from '../config/redis.js';

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
  const smsSent = await sendSMS(phone, `Dear ${name}, your user account has been created successfully by admin.`);
  if (!smsSent) throw new Error('Failed to send notification SMS. Please try again.');

  return user;
};

export const deactivateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');
  if (user.role !== 'user') throw new Error('Cannot deactivate non-user account');

  user.isActive = false;
  await user.save();
  return user;
};

export const activateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');
  if (user.role !== 'user') throw new Error('Cannot activate non-user account');

  user.isActive = true;
  await user.save();
  return user;
};

export const createAdminOTP = async (email, password) => {
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    console.log('Invalid admin login attempt for email:', email);
    throw new Error('Invalid admin credentials');
  }

  const otp = generateOTP(6);
  await redisClient.setEx(`otp:admin-login:${email}`, 300, otp);

  const emailSent = await sendEmail(
    email,
    'Admin Login OTP',
    `Use this code to finish your login: ${otp}`
  );
  if (!emailSent) throw new Error('Failed to send OTP. Please try again.');

  return { message: 'OTP sent to admin email.' };
};

export const verifyAdminOTP = async (email, otp) => {
  const storedOtp = await redisClient.get(`otp:admin-login:${email}`);
  if (!storedOtp) throw new Error('OTP expired or not found');
  if (storedOtp !== otp) throw new Error('Invalid OTP');

  await redisClient.del(`otp:admin-login:${email}`);

  const token = generateToken({ role: 'admin', email });
  return { token, message: 'Admin logged in successfully.' };
};

export const loginUserService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
    permissions: user.customPermissions || []
  });

  return { user, token };
};