import UserService from "../services/users.service.js";
import { STATUS } from "../utilidades/constantes.js";
import {UserResponseDTO} from "../models/dtos/users.dto.js"
import SessionService from "../services/session.service.js";
import nodemailer from "nodemailer";
import CONFIG from "../config/config.js";
import { sendDeletionEmail } from "../services/mailing.js";
import { sendExpirationEmail } from "../services/mailing.js";



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
      const { userId } = req.params;
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
  
  async getAllUsers(req, res, next) {
    try {
      const usersResponse = await UserService.getAllUsers();
  
      res.status(200).json(usersResponse);
    } catch (error) {
      next(error);
    }
  }


  async deleteUsers(req, res, next) {
    try {
      const usersResponse = await UserService.getAllUsers();
      console.log("los usuarios Kills: ",usersResponse)
  
      const formattedUsers = usersResponse.message.map(user => new UserResponseDTO(user));
  
      res.status(200).json(formattedUsers);
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

  async deleteAllUsers2(req, res, next) {
    const emailToDelete = req.body.email;
  
    try {
      const usersResponse = await UserService.getAllUsers();
      const sessionResponse = await SessionService.getAllSession();
  
      const users = usersResponse.message;
      const sessions = sessionResponse.message;
  
      const matchingUsers = users.filter((user) => {
        const session = sessions.find((session) => session.email === user.email);
        return session !== undefined;
      });
  
      const usersWithSessionInfo = matchingUsers.map((user) => {
        const session = sessions.find((session) => session.email === user.email);
        return {
          ...user,
          mail: user.email,
          expires: session.expires,
        };
      });
  
      function checkSessionExpiry(usersWithSessionInfo) {
        const currentTime = new Date();
        const thirtyMinutesLater = new Date(currentTime.getTime() + 30 * 60000);
        return usersWithSessionInfo.map((user) => {
          const expiryTime = new Date(user.expires);
          const isSessionExpired = expiryTime < thirtyMinutesLater;
          const sessionStatus = isSessionExpired
            ? `La sesión del usuario ${user.first_name} ${user.last_name} ya expiró.`
            : `La sesión del usuario ${user.first_name} ${user.last_name} es válida.`;
  
          if (isSessionExpired) {
            sendExpirationEmail(
              user.mail,
              `${user.first_name} ${user.last_name}`
            ).catch((error) => {
              console.error("Error al enviar correo de expiración:", error);
            });
          }
  
          // Formatear la fecha de expiración a la hora local de Argentina
          const expiryLocalTime = expiryTime.toLocaleString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
          });
  
          return {
            user: `${user.first_name} ${user.last_name}`,
            sessionStatus: sessionStatus,
            expiryLocalTime: expiryLocalTime,
            isSessionExpired: isSessionExpired,
          };
        });
      }
  
      console.log("emailToDelete: ", emailToDelete);
  
      const sessionStatuses = checkSessionExpiry(usersWithSessionInfo);
  
      console.log("sessionStatuses: ", sessionStatuses);
  
      res.status(200).json(sessionStatuses);
    } catch (error) {
      next(error);
    }
  }
  


  async deleteAllUsers(req, res, next) {
    const emailToDelete = req.body.email;
  
    try {
      const usersResponse = await UserService.getAllUsers();
      const users = usersResponse.message;
  
      const userToDelete = users.find((user) => user.email === emailToDelete);
  
      if (userToDelete) {
        await UserService.deleteUserByEmail(emailToDelete);
  
     
        await sendDeletionEmail(
          emailToDelete,
          `${userToDelete.first_name} ${userToDelete.last_name}`
        );
  
        res.status(200).json({
          message: 'Usuario eliminado con éxito y notificado por correo electrónico.',
        });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado.' });
      }
    } catch (error) {
      next(error);
    }
  }
  
  async userNonActive(req, res, next) {

    try {
      const usersResponse = await UserService.getAllUsers();
      const sessionResponse = await SessionService.getAllSession();

      const users = usersResponse.message;
      const sessions = sessionResponse.message;

      const usersWithoutSession = users.filter((user) => {
        const session = sessions.find((session) => session.email === user.email);
        return session === undefined; 
      });

      const usersWithNoSessionInfo = usersWithoutSession.map((user) => {
        return {
          ...user,
          mail: user.email,
         
        };
      });

    
      res.status(200).json(usersWithNoSessionInfo);
    } catch (error) {
      next(error);
    }
  }
  
}
export default new UserController();