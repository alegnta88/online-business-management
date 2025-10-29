import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { sendSMS } from '../utils/sendSMS.js';
import { generateOTP } from '../utils/otpGenerator.js';
import dotenv from "dotenv";

dotenv.config();

// register new user

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email format not supported' });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 4-digit OTP
    const otp = generateOTP(6);

    const newUser = new UserModel({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    await newUser.save();

    // Send OTP via SMS

    const smsText = `Dear ${name}, Your verification code is ${otp}, Thank you for choosing Digaf!`;
    const smsSent = await sendSMS(phone, smsText);

    if (!smsSent) {
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    res.status(201).json({
      message: 'User registered successfully. OTP sent to phone.',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// verify OTP

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined; 
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'OTP verified successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Incorrect Email' });

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified. Please check your OTP.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'User logged in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// admin login 


const isAdmin = (email, password) => {
  
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isAdmin(email, password)) {
      const token = jwt.sign(
        { role: 'admin', email: email }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
};


// get all users

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

export { registerUser, loginUser, adminLogin, getAllUsers, verifyOTP };