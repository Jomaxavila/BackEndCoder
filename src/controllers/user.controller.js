import UserService from "../services/users.service.js";
import { STATUS } from "../utilidades/constantes.js";
import jwt from 'jsonwebtoken';


class UserController{
  
  async login(req, res) {
    const { email, password } = req.body;
  
    try {
      const loginResult = await UserService.login(email, password);
      const token = loginResult.access_token; 
      res.cookie('access_token', token, {
        maxAge: loginResult.cookieOptions.maxAge,
        httpOnly: loginResult.cookieOptions.httpOnly,
      });
      res.json({ payload: loginResult.payload });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
  
  async createUser(req, res) {
    try {
        const data = req.body;
        const role = req.body.role || 'usuario'; 
        const response = await UserService.createUser(data, role);
        res.status(201).json({ user: response, status: STATUS.SUCCESS });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL
        });
    }
}

    async getUser(req, res) {
      try {
          const { email } = req.body;
          const users = await UserService.getUser(email);
          if (users.length === 0) {
              res.status(404).json({ message: 'Usuario no encontrado' });
          } else {
              const user = users[0];
              res.status(200).json({ user, status: STATUS.SUCCESS });
          }
      } catch (error) {
          res.status(400).json({
              error: error.message,
              status: STATUS.FAIL
          });
      }
  }
  
}

export default new UserController();
