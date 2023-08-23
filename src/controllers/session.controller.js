
import SessionService from "../services/session.service.js";

const sessionService = new SessionService();

class SessionController {
  async restartPassword(req, res) {
    const { email, password } = req.body;
    const response = await sessionService.restartPassword(email, password);
    res.status(response.status === "success" ? 200 : 400).json(response);
  }

  async registerUser(req, res) {
    const { first_name, last_name, email, age, password } = req.body;
    const response = await sessionService.registerUser(first_name, last_name, email, age, password);
    res.status(response.status === "success" ? 200 : 400).json(response);
  }

  async loginUser(req, res) {
    const response = await sessionService.loginUser(req);
    res.status(response.status === 'success' ? 200 : 401).json(response);
  }

  async logout(req, res) {
    const response = await sessionService.logout(req);
    if (response.status === "success") {
      res.clearCookie("connect.sid");
      res.redirect("/login"); 
    } else {
  
      res.status(500).json(response);
    }
  }
  
  async getCurrentSession(req, res) {
    const response = await sessionService.getCurrentSession(req);
    res.status(response.status === "success" ? 200 : 500).json(response);
  }

  async handleGitHubCallback(req, res) {
    const response = await sessionService.handleGitHubCallback(req);
    if (response.status === "success") {
      res.redirect("/");
    } else {
      res.status(500).json(response);
    }
  }

  async failRegister(req, res) {
    const response = await sessionService.failRegister();
    res.status(200).json(response);
  }

  async githubCallbackFail(req, res) {
    const response = await sessionService.githubCallbackFail();
    res.redirect("/login");
  }

  async githubLogin(req, res) {
  }
}

export default SessionController;
