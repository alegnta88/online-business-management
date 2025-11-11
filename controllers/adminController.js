import UserModel from "../models/userModel.js";
import { assignPermissionsService } from "../services/permissionService.js";

export const assignRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const allowedRoles = ["user", "admin", "customer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    } 

    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (existingUser.role === role) {
      return res.status(400).json({
        success: false,
        message: `User is already assigned the role '${role}'`
      });
    }

    existingUser.role = role;
    await existingUser.save();

    const safeUser = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      isActive: existingUser.isActive,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    res.json({
      success: true,
      message: `Role updated successfully to ${role}`,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllAdmins = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const cursor = req.query.cursor;

    const query = { role: 'admin' };
    if (cursor) query._id = { $gt: cursor };

    const admins = await UserModel.find(query)
      .select('-password')
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor = admins.length ? admins[admins.length - 1]._id : null;

    res.json({
      success: true,
      admins,
      nextCursor
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { id, customPermissions } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const updatedUser = await assignPermissionsService(id, customPermissions);

    res.json({
      success: true,
      message: "Permissions updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        customPermissions: updatedUser.customPermissions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

