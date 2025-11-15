import jwt from 'jsonwebtoken';

export default function roleAuth(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (allowedRoles.length === 0 || allowedRoles.includes(payload.role)) {
        return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}