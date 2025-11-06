import jwt from 'jsonwebtoken';

const customerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user role is admin
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Access denied. Customer only.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Customer auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default customerAuth;