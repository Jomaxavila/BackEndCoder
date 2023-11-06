import UserService from "../services/users.service.js";
import { STATUS } from "../utilidades/constantes.js";
import {UserResponseDTO} from "../models/dtos/users.dto.js"
import SessionService from "../services/session.service.js";
import nodemailer from "nodemailer";


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
  
      const formattedUsers = usersResponse.message.map(user => new UserResponseDTO(user));
  
      res.status(200).json(formattedUsers);
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

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: "quirogaserastour@gmail.com",
        pass: "xrvvaihydfcgwofd",
      },
    });

    // Esta es una función auxiliar para enviar correos electrónicos
    function sendExpirationEmail(userEmail, userName) {
      const mailOptions = {
        from: "quirogaserastour@gmail.com",
        to: "quirogaserastour@gmail.com",
        subject: "Notificación de expiración de sesión",
        text: `Hola ${userName},\n\nTu sesión ha expirado. Por favor, inicia sesión de nuevo si deseas continuar utilizando el servicio.\n\nSaludos,\nEl equipo de soporte`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error al enviar correo:", error);
        } else {
          console.log("Correo enviado: " + info.response);
        }
      });
    }

    try {
      const usersResponse = await UserService.getAllUsers();
      const sessionResponse = await SessionService.getAllSession();

      const users = usersResponse.message;
      const sessions = sessionResponse.message;

      const matchingUsers = users.filter((user) => {
        const session = sessions.find(
          (session) => session.email === user.email
        );
        return session !== undefined; // Si se encuentra una sesión, se incluye el usuario
      });

      const usersWithSessionInfo = matchingUsers.map((user) => {
        const session = sessions.find(
          (session) => session.email === user.email
        );
        return {
          ...user,
          mail: user.email,
          expires: session.expires,
        };
      });

      // Función para filtrar por 30 min y devolver el estado de la sesión
      function checkSessionExpiry(usersWithSessionInfo) {
        const currentTime = new Date();
        const thirtyMinutesLater = new Date(currentTime.getTime() + 30 * 60000); // 30 minutos en milisegundos
        return usersWithSessionInfo.map((user) => {
          const expiryTime = new Date(user.expires);
          const isSessionExpired = expiryTime < thirtyMinutesLater;
          const sessionStatus = isSessionExpired
            ? `La sesión del usuario ${user.first_name} ${user.last_name} ya expiró.`
            : `La sesión del usuario ${user.first_name} ${user.last_name} es válida.`;

          if (isSessionExpired) {
            // Envía un correo electrónico al usuario notificándole que su sesión ha expirado
            sendExpirationEmail(
              user.email,
              `${user.first_name} ${user.last_name}`
            );
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

      console.log("emailToDelete: ", emailToDelete)

      // Obtener el estado de la sesión para cada usuario
      const sessionStatuses = checkSessionExpiry(usersWithSessionInfo);

      console.log("sessionStatuses: ", sessionStatuses);


      // Enviar el estado de la sesión como parte de la respuesta JSON
      res.status(200).json(sessionStatuses);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllUsers(req, res, next) {
    const emailToDelete = req.body.email;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "quirogaserastour@gmail.com",
        pass: "xrvvaihydfcgwofd",
      },
    });
  
    // Esta es una función auxiliar para enviar correos electrónicos
    function sendDeletionEmail(userEmail, userName) {
      const mailOptions = {
        from: "quirogaserastour@gmail.com",
        to: "quirogaserastour@gmail.com",
        subject: "Notificación de eliminación de cuenta",
        text: `Hola ${userName},\n\nTu cuenta ha sido eliminada por inactividad.\n\nSaludos,\nEl equipo de soporte`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error al enviar correo:", error);
        } else {
          console.log("Correo enviado: " + info.response);
        }
      });
    }
  
    try {
      // Obtener todos los usuarios
      const usersResponse = await UserService.getAllUsers();
      const users = usersResponse.message;
  
      // Buscar el usuario con el email proporcionado
      const userToDelete = users.find(user => user.email === emailToDelete);
  
      if (userToDelete) {
        // Eliminar el usuario utilizando el UserService
        await UserService.deleteUserByEmail(emailToDelete);
  
        // Enviar correo electrónico al usuario notificando la eliminación de la cuenta
        sendDeletionEmail(emailToDelete, `${userToDelete.first_name} ${userToDelete.last_name}`);
  
        // Enviar respuesta de éxito
        res.status(200).json({ message: 'Usuario eliminado con éxito y notificado por correo electrónico.' });
      } else {
        // Enviar una respuesta de error si no se encuentra el usuario
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
          // Puedes agregar más información relevante aquí si es necesario
        };
      });

      // Enviar lista de usarios que no estan con sesion activa
      res.status(200).json(usersWithNoSessionInfo);
    } catch (error) {
      next(error);
    }
  }
  
}
export default new UserController();