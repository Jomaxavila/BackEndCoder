import jwt from 'jsonwebtoken';
import CONFIG from './config.js';

 const auth = (role) => {
  return async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decodedToken = jwt.verify(token, CONFIG.SECRET_KEY);
      if (decodedToken.role !== role) {
        return res.status(403).json({ error: 'Access Denied' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};
export default auth;