import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const auth = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access Denied" });
    }

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decodedToken = jwt.verify(token, SECRET_KEY);
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

export default auth;
