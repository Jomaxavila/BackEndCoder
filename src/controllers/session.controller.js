
import SessionService from "../services/session.service.js";
import { SaveUsersDTO } from "../models/dtos/users.dto.js";



class SessionController {
  async restartPassword(req, res) {
    const { email, password } = req.body;
    const response = await SessionService.restartPassword(email, password);
    res.status(response.status === "success" ? 200 : 400).json(response);

  }

  async registerUser(req, res) {
    const { first_name, last_name, email, age, password } = req.body;
    const response = await SessionService.registerUser(first_name, last_name, email, age, password);
    res.status(response.status === "success" ? 200 : 400).json(response);
  }

  async loginUser(req, res) {
    const response = await SessionService.loginUser(req);
    res.status(response.status === 'success' ? 200 : 401).json(response);
    
  }

  async logout(req, res) {
    const response = await SessionService.logout(req);
    if (response.status === "success") {
      res.clearCookie("connect.sid");
      res.redirect("/"); 
    } else {
  
      res.status(500).json(response);
    }
  }
  
  async getCurrentSession(req, res) {
    const currentUser = req.user; // Usuario actual obtenido de la sesión
    const userDTO = new SaveUsersDTO({
      name: `${currentUser.first_name} ${currentUser.last_name}`,
      email: currentUser.email,
      age: currentUser.age,
    });

    res.status(200).json(userDTO); // Responde con el DTO del usuario
  }

  async handleGitHubCallback(req, res) {
    const response = await SessionService.handleGitHubCallback(req);
    if (response.status === "success") {
      res.redirect("/");
    } else {
      res.status(500).json(response);
    }
  }

  async failRegister(req, res) {
    const response = await SessionService.failRegister();
    res.status(200).json(response);
  }

  async githubCallbackFail(req, res) {
    const response = await SessionService.githubCallbackFail();
    res.redirect("/login");
  }

  async githubLogin(req, res) {
  }
}

export default new SessionController();
