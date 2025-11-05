import jwt from 'jsonwebtoken';

export default function adminOrUserAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin' || decoded.role === 'user') {
      req.user = decoded; 
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Only admins or users can add products.',
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}