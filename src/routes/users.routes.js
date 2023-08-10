import { Router } from 'express';
import { generateToken } from '../utils.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;


  if (email === "jomaxavila@gmail.com" && password === "1234") {
    const access_token = generateToken({ email, role: 'user' });

    res.cookie('maxcookie7', access_token, {
      maxAge: 60 * 60 * 1000, 
      httpOnly: true,
    });

    res.json({ payload: 'OK' });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

export default router;
