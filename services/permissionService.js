import UserModel from "../models/userModel.js";
import { rolePermissions } from "../utils/rolePermission.js";

export const assignPermissionsService = async (userId, customPermissions = []) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (!Array.isArray(customPermissions)) {
    customPermissions = [customPermissions];
  }

  const rolePerms = rolePermissions[user.role] || [];
  const mergedPermissions = Array.from(new Set([...rolePerms, ...customPermissions]));

  user.permissions = mergedPermissions;
  user.customPermissions = customPermissions;

  await user.save();

  return user;
};
