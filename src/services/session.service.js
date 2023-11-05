import userModel from "../models/schemas/usersModel.js";
import { createHash } from "../utils.js";
import CONFIG from "../config/config.js";
import MailingService from "./mailing.js";
import jwt from "jsonwebtoken";
import sessionModel from '../models/schemas/sessionModel.js';
import { SessionResponseDTO } from '../models/dtos/session.dto.js';

class SessionService {
  async registerUser(first_name, last_name, email, age, password) {
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return { status: "error", error: "El usuario ya existe" };
      }
  
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password), 
      };
  
      await userModel.create(newUser);
      return { status: "success", message: "Usuario registrado exitosamente" };
    } catch (error) {
      console.log("Error en el registro:", error);
      return { status: "error", error: "Error al registrar usuario" };
    }
  }
  
  
  
  async restartPassword(email, newPassword) {
    if (!email || !newPassword) {
      return { status: "error", error: "Valores incompletos" };
    }
  
    const user = await userModel.findOne({ email });
    console.log('User:', user);
  
    if (!user) {
      return { status: "error", error: "Usuario no encontrado" };
    }
  
    const newPasswordHash = createHash(newPassword);
    console.log('New Password Hash:', newPasswordHash);
    console.log('User Password:', user.password);
  
    if (newPasswordHash === user.password) {
      console.log('Password Matched:', newPasswordHash, user.password);
      return { status: "error", error: "La nueva contraseña no puede ser igual a la contraseña anterior" };
    }
  
    const newHashedPassword = createHash(newPassword);
  
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );
  
    return { status: "success", message: "Contraseña restaurada" };
  }
  
  
  async loginUser(req) {
    try {
      req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
      return {
        status: 'success',
        payload: req.session.user,
        message: 'Inicio de sesión exitoso',
      };
    } catch (error) {
      console.log('Error en el inicio de sesión:', error);
      return { status: 'error', error: 'Error al iniciar sesión' };
    }
  }

  async logout(req) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.log("Error al destruir la sesión:", err);
          resolve({ status: "error", error: "Error al cerrar sesión" });
        } else {
          resolve({ status: "success", message: "Sesión cerrada correctamente" });
        }
      });
    });
  }

  async getSession(req) {
    try {
      const currentUser = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
      return { status: "success", user: currentUser };
    } catch (error) {
      console.log("Error al obtener la sesión actual:", error);
      return { status: "error", error: "Error al obtener la sesión actual" };
    }
  }

  async getAllSession() {
    try {
      const session = await sessionModel.find();
      const sessionDTO = session.map((s) => new SessionResponseDTO(s._doc));
      return {
        code: 202,
        status: "success",
        message: sessionDTO,
      };
    } catch (error) {
      console.error("Error al obtener las sessions:", error.message);
      return {
        code: 500,
        status: "error",
        message: "Error al obtener las sessions",
      };
    }
  }

  async sendResetMail(email) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return { status: "error", error: "Correo no encontrado" };
      }

      const resetToken = await this.generatePasswordResetToken(user._id);

      const resetLink = `${"http://localhost:8080"}/restartPassword/${resetToken}`;

      const emailContent = `
        <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
      `;

      const emailResult = await MailingService.sendSimpleMail({
        from: CONFIG.MAILING_USER,
        to: email,
        subject: "Restablecimiento de contraseña",
        html: emailContent,
      });

      if (emailResult) {
        return { status: "success", message: "Correo de restablecimiento enviado" };
      } else {
        return { status: "error", error: "Error al enviar el correo" };
      }
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
      return { status: "error", error: "Error al enviar el correo de restablecimiento de contraseña" };
    }
  }


  async generatePasswordResetToken(userId) {
    try {
      const secretKey = CONFIG.SECRET_KEY;
      const expirationTime = '1h'; 

      const payload = { userId };

      const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });

      return token;
    } catch (error) {
      console.error('Error al generar el token de restablecimiento de contraseña:', error);
      throw error; 
    }
  }
}

export default new SessionService();
