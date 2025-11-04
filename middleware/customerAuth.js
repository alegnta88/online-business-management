import jwt from 'jsonwebtoken';

const customerAuth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error('User auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default customerAuth;