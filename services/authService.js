import { createAdminOTP, verifyAdminOTP, loginUserService } from './userService.js';

export const handleLogin = async ({ email, password }) => {

  if (email === process.env.ADMIN_EMAIL) {
    if (password !== process.env.ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials');
    }

    await createAdminOTP(email, password);

    return {
      isAdmin: true,
      message: 'OTP sent to your email. Please verify to complete admin login.'
    };
  }

  const { user, token } = await loginUserService({ email, password });

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  return {
    isAdmin: false,
    message: `Login successful as ${user.role}`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};


export const handleAdminOTPVerification = async ({ email, otp }) => {
  if (email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized email for admin OTP');
  }

  const { token, message } = await verifyAdminOTP(email, otp);

  return { token, message };
};
