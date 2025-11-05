import UserModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendSMS } from '../utils/sendSMS.js';
import { generateToken } from '../utils/jwt.js';

// Register user
export const registerUserService = async ({ name, email, phone, password, role }, isAdmin = false) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP(6);

  const userRole = isAdmin ? role || 'user' : 'customer';

  const user = new UserModel({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    role: userRole,
    isVerified: isAdmin ? true : false, 
  });

  await user.save();

  // Send OTP 
  if (!isAdmin) {
    const smsSent = await sendSMS(phone, `Dear ${name}, your OTP is ${otp}`);
    if (!smsSent) throw new Error('Failed to send OTP. Please try again.');
  }

  return user;
};

// Verify OTP
export const verifyOTPService = async ({ email, otp }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('User already verified');
  if (user.otp !== otp) throw new Error('Invalid OTP');

  user.isVerified = true;
  user.otp = null;
  await user.save();

  const smsSent = await sendSMS(
    user.phone,
    `Dear ${user.name}, your registration is verified successfully.`
  );
  if (!smsSent) throw new Error('Failed to send verification SMS.');

const token = generateToken({ id: user._id, email: user.email, role: user.role });
  return { user, token };
};

// Login
export const loginUserService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');
  if (!user.isVerified) throw new Error('Please verify your account first');

  if (!user.isActive) {
    throw new Error('Your account has been deactivated. Please contact support.');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({ id: user._id, email: user.email, role: user.role });
  return { user, token };
};

// deactivate user
export const deactivateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');

  user.isActive = false;
  await user.save();

  return user;
};

// activate user 
export const activateUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');

  user.isActive = true;
  await user.save();

  return user;
};
