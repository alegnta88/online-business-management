import UserModel from "../models/userModel.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log('User from database:', {
      id: user._id,
      email: user.email,
      customPermissions: user.customPermissions
    });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
      email: user.email,
      permissions: user.customPermissions || [], 
    };

    console.log('Token payload being created:', tokenPayload);

    const token = generateToken(tokenPayload);

    res.json({
      success: true,
      message: `Login successful as ${user.role}`,
      role: user.role,
      permissions: user.customPermissions || [],
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};