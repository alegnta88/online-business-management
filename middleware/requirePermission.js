export const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userPermissions = user.customPermissions || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `You do not have permission: ${permission}`
      });
    }
    next();
  };
};