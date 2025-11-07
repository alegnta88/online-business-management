import CustomerModel from '../models/customerModel.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendSMS } from '../utils/sendSMS.js';
import { generateToken } from '../utils/jwt.js';

const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

export const registerCustomerService = async ({ name, email, phone, password }) => {
  const existingCustomer = await CustomerModel.findOne({ email });
  if (existingCustomer) throw new Error('Customer already exists');

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP(6);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  const customer = new CustomerModel({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    otpExpiresAt: expiresAt,
    role: 'customer',
    isVerified: false,
    twoFAEnabled: false,
  });

  await customer.save();

  const smsSent = await sendSMS(phone, `Dear ${name}, your registration OTP is ${otp}`);
  if (!smsSent) throw new Error('Failed to send OTP. Please try again.');

  return customer;
};

export const verifyCustomerOTPService = async ({ email, otp }) => {
  const customer = await CustomerModel.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (customer.isVerified) throw new Error('Customer already verified');
  if (isOTPExpired(customer.otpExpiresAt)) throw new Error('OTP expired');
  if (customer.otp !== otp) throw new Error('Invalid OTP');

  customer.isVerified = true;
  customer.otp = null;
  customer.otpExpiresAt = null;
  await customer.save();

  const token = generateToken({ id: customer._id, email: customer.email, role: customer.role });

  await sendSMS(customer.phone, `Dear ${customer.name}, your registration is verified successfully.`);

  return { customer, token };
};


export const loginCustomerService = async ({ email, password }) => {
  const customer = await CustomerModel.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (!customer.isVerified) throw new Error('Please verify your account first');
  if (!customer.isActive) throw new Error('Your account has been deactivated. Contact support.');

  const isMatch = await comparePassword(password, customer.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  customer.otp = otp;
  customer.otpExpiresAt = expiresAt;
  await customer.save();

  await sendSMS(customer.phone, `Dear ${customer.name}, your login OTP is ${otp}`);

  return { message: 'OTP sent to your registered phone number', email: customer.email };
};

// Verify 2FA OTP for login
export const verify2FALoginService = async ({ email, otp }) => {
  const customer = await CustomerModel.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (isOTPExpired(customer.otpExpiresAt)) throw new Error('OTP expired');
  if (customer.otp !== otp) throw new Error('Invalid OTP');

  customer.otp = null;
  customer.otpExpiresAt = null;
  await customer.save();

  const token = generateToken({ id: customer._id, email: customer.email, role: customer.role });

  return { customer, token };
};

export const enable2FAService = async (customerId) => {
  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new Error('Customer not found');
  if (customer.twoFAEnabled) throw new Error('2FA is already enabled.');

  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  customer.otp = otp;
  customer.otpExpiresAt = expiresAt;
  await customer.save();

  await sendSMS(customer.phone, `Your 2FA activation code is ${otp}`);

  return { message: 'OTP sent to your phone for 2FA activation.' };
};

export const verifyEnable2FAService = async ({ customerId, otp }) => {
  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new Error('Customer not found');
  if (isOTPExpired(customer.otpExpiresAt)) throw new Error('OTP expired');
  if (customer.otp !== otp) throw new Error('Invalid OTP');

  customer.twoFAEnabled = true;
  customer.otp = null;
  customer.otpExpiresAt = null;
  await customer.save();

  return { message: '2FA enabled successfully.' };
};

// Deactivate customer
export const deactivateCustomerService = async (id) => {
  const customer = await CustomerModel.findById(id);
  if (!customer) throw new Error('Customer not found');
  if (!customer.isActive) throw new Error('Customer already deactivated');

  customer.isActive = false;
  await customer.save();

  return customer;
};

// Activate customer
export const activateCustomerService = async (id) => {
  const customer = await CustomerModel.findById(id);
  if (!customer) throw new Error('Customer not found');
  if (customer.isActive) throw new Error('Customer already active');

  customer.isActive = true;
  await customer.save();

  return customer;
};

// Get all customers
export const getAllCustomersService = async (limit = 10, cursor) => {
  const query = cursor ? { _id: { $gt: cursor } } : {};
  const customers = await CustomerModel.find(query)
    .select('-password')
    .sort({ _id: -1 })
    .limit(limit);

  const nextCursor = customers.length ? customers[customers.length - 1]._id : null;
  return { customers, nextCursor };
};
