import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Access denied. User only.' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('user auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default userAuth;