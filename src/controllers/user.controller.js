import UserService from "../services/users.service.js";
import { STATUS } from "../utilidades/constantes.js";

class UserController {
   async login(req, res, next) {
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
      next(error);
    }
  }

   async createUser(req, res, next) {
    try {
      const data = req.body;
      const role = req.body.role || 'usuario';
      const response = await UserService.createUser(data, role);
      res.status(201).json({ user: response, status: STATUS.SUCCESS });
    } catch (error) {
      next(error);
    }
  }

 async getUser(req, res, next) {
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
      next(error);
    }
  }

  async changeUserRole(req, res) {
    try {
      const { uid, newRole } = req.body;
  
      if (newRole !== 'user' && newRole !== 'premium') {
        return res.status(400).json({ message: 'El nuevo rol no es válido' });
      }
  
      const result = await UserService.changeUserRole(uid, newRole);
  
      if (result.status === 'success') {
        return res.status(200).json({ message: 'Rol de usuario actualizado con éxito' });
      } else {
        return res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
      }
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
}

export default new UserController();
