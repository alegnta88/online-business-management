import UserModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendSMS } from '../utils/sendSMS.js';
import { validateRegistration } from '../validators/userValidator.js';

export const registerUserService = async (data) => {
  const { name, phone, email, password } = data;

  const validationError = validateRegistration(data);
  if (validationError) throw new Error(validationError);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP(6);

  const newUser = new UserModel({ name, phone, email, password: hashedPassword, otp, isVerified: false });
  await newUser.save();

  const smsText = `Dear ${name}, Your verification code is ${otp}, Thank you for choosing Digaf!`;
  const smsSent = await sendSMS(phone, smsText);
  if (!smsSent) throw new Error('Failed to send OTP. Please try again.');

  return newUser;
};

export const verifyOTPService = async ({ userId, otp }) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.otp !== otp) throw new Error('Invalid OTP');

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  const token = generateToken({ id: user._id });
  return { token, user };
};

export const loginUserService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Incorrect Email');
  if (!user.isVerified) throw new Error('Account not verified');

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  const token = generateToken({ id: user._id });
  return { token, user };
};
