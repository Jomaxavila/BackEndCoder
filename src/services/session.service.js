import userModel from "../models/schemas/usersModel.js";
import { createhast } from "../utils.js";
import CONFIG from "../config/config.js";

class SessionService {
  async restartPassword(email, password) {
    if (!email || !password)
      return { status: "error", error: "Valores incompletos" };

    const user = await userModel.findOne({ email });
    if (!user)
      return { status: "error", error: "Usuario no encontrado" };

    const newHashedPassword = createhast(password);
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );

    return { status: "success", message: "Contraseña restaurada" };
  }

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
        password: createhast(password),
      };

      await userModel.create(newUser);
      return { status: "success", message: "Usuario registrado exitosamente" };
    } catch (error) {
      console.log("Error en el registro:", error);
      return { status: "error", error: "Error al registrar usuario" };
    }
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

  async handleGitHubCallback(req) {
    try {
      req.session.user = req.user;
      return { status: "success", message: "Callback de GitHub exitoso" };
    } catch (error) {
      console.log("Error en el callback de GitHub:", error);
      return { status: "error", error: "Error en el callback de GitHub" };
    }
  }

  async failRegister() {
    try {
      return { error: "failed" };
    } catch (error) {
      console.log("Error en la ruta /failregister:", error);
      return { status: "error", error: "Error en la ruta /failregister" };
    }
  }

  async githubCallbackFail() {
    try {
      return { status: "success", message: "Callback de GitHub fallido redireccionado a /login" };
    } catch (error) {
      console.log("Error en el callback de GitHub al fallar:", error);
      return { status: "error", error: "Error en el callback de GitHub al fallar" };
    }
  }

  async githubLogin() {
  }
  
   async generateToken(_id) {
    const token = jwt.sign({ user: _id }, CONFIG.SECRET_KEY, { expiresIn: '12h' });
    return token;
  }
}

export default new SessionService();
