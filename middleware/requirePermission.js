export const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    console.log('=== Permission Check ===');
    console.log('Required permission:', permission);
    console.log('User object:', user);
    console.log('User permissions:', user?.permissions);
    console.log('Checking if includes:', user?.permissions?.includes(permission));
    console.log('========================');

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userPermissions = user.permissions || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `You do not have permission: ${permission}`
      });
    }

    next();
  };
};