import UserModel from "../models/userModel.js";
import RoleModel from "../models/roleModel.js";

export const assignCustomPermissions = async (req, res) => {
  try {
    const { id, permissions } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can manage permissions" });
    }

    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: "Permissions must be an array" });
    }

    const role = await RoleModel.findOne({ name: user.role });
    const basePermissions = role ? role.permissions : [];

    user.customPermissions = permissions;
    user.permissions = [...new Set([...basePermissions, ...permissions])];

    await user.save();

    res.json({
      success: true,
      message: "Custom permissions assigned successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        customPermissions: user.customPermissions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};