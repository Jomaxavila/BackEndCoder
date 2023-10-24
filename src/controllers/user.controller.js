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
      const { userId } = req.body;
      const user = await UserService.getUser(userId);
  
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.status(200).json({ user, status: STATUS.SUCCESS });
      }
    } catch (error) {
      next(error);
    }
  }
  

  async changeToPremium(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserService.getUser(uid);
  
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      if (user.role === 'premium' || user.role === 'usuario') {
        if (user.role === 'usuario') {
          const hasRequiredDocuments = await UserService.hasRequiredDocuments(uid);
          if (!hasRequiredDocuments) {
            return res.status(400).json({ message: 'El usuario no ha terminado de procesar su documentación.' });
          }
        }
  
        user.role = 'premium';
        user.status = 'complete';
        await user.save();
  
        return res.status(200).json({ message: 'Rol de usuario actualizado a premium con éxito' });
      } else {
        return res.status(400).json({ message: 'El nuevo rol no es válido' });
      }
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  async uploadDocuments(req, res, next) {
    const { uid } = req.params;
    const { profileImage, productImage, documents } = req.files;
  
    console.log('Received files:', req.files);
    console.log('UID:', uid);
  
    if (profileImage) {
      console.log('Uploading profile image...');
      await UserService.updateUserDocuments(uid, 'profileImage', profileImage[0].filename);
    } else if (productImage) {
      console.log('Uploading product image...');
      await UserService.updateUserDocuments(uid, 'productImage', productImage[0].filename);
    } else if (documents) {
      console.log('Uploading document...');
      await UserService.updateUserDocuments(uid, 'documents', documents[0].filename);
    } else {
      return res.status(400).json({ message: 'No se proporcionaron archivos válidos' });
    }
  
    res.status(200).json({ message: 'Documentos cargados con éxito' });
  }
  
  
}
export default new UserController();