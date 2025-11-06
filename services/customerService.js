import CustomerModel from '../models/customerModel.js'; 
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendSMS } from '../utils/sendSMS.js';
import { generateToken } from '../utils/jwt.js';

// Register a new customer
export const registerCustomerService = async ({ name, email, phone, password }) => {
  const existingCustomer = await CustomerModel.findOne({ email });
  if (existingCustomer) throw new Error('Customer already exists');

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP(6);

  const customer = new CustomerModel({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    role: 'customer',
    isVerified: false, 
  });

  await customer.save();

  // Send OTP via SMS
  const smsSent = await sendSMS(phone, `Dear ${name}, your OTP is ${otp}`);
  if (!smsSent) throw new Error('Failed to send OTP. Please try again.');

  return customer;
};

// Verify OTP for customer
export const verifyCustomerOTPService = async ({ email, otp }) => {

  const customer = await CustomerModel.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (customer.isVerified) throw new Error('Customer already verified');
  if (customer.otp !== otp) throw new Error('Invalid OTP');

  customer.isVerified = true;
  customer.otp = null;
  await customer.save();

  const token = generateToken({ id: customer._id, email: customer.email, role: customer.role });

  const smsSent = await sendSMS(customer.phone, `Dear ${customer.name}, your registration is verified successfully.`);
  if (!smsSent) throw new Error('Failed to send verification SMS.');

  return { customer, token };
};

// Customer login
export const loginCustomerService = async ({ email, password }) => {
  const customer = await CustomerModel.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (!customer.isVerified) throw new Error('Please verify your account first');
  if (!customer.isActive) throw new Error('Your account has been deactivated. Contact support.');

  const isMatch = await comparePassword(password, customer.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken({ id: customer._id, email: customer.email, role: customer.role });
  return { customer, token };
};

// Deactivate customer
export const deactivateCustomerById = async (id) => {
  const customer = await CustomerModel.findById(id);
  if (!customer) throw new Error('Customer not found');
  if (customer.role !== 'customer') throw new Error('This account is not a customer account!');

  customer.isActive = false;
  await customer.save();
  return customer;
};

// Activate customer
export const activateCustomerById = async (id) => {
  const customer = await CustomerModel.findById(id);
  if (!customer) throw new Error('Customer not found');
  if (customer.role !== 'customer') throw new Error('Cannot activate non-customer account');

  customer.isActive = true;
  await customer.save();
  return customer;
};