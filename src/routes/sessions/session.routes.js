import { Router } from "express";
import passport from "passport";
import SessionController from "../../controllers/session.controller.js"



class SessionRouter {
  constructor() {
    this.sessionRouter = Router();
   
    this.sessionRouter.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"] }),
      SessionController.handleGitHubCallback.bind(SessionController)
    );

    this.sessionRouter.get(
      "/githubcallback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      SessionController.handleGitHubCallback.bind(SessionController)
    );

    this.sessionRouter.get("/failregister", SessionController.failRegister.bind(SessionController));

    this.sessionRouter.post("/restartPassword", SessionController.restartPassword.bind(SessionController));

    this.sessionRouter.post("/register", SessionController.registerUser.bind(SessionController));

    this.sessionRouter.post(
      "/login",
      passport.authenticate("local"),
      SessionController.loginUser.bind(SessionController) // Cambio aquí
    );

    this.sessionRouter.post("/logout", SessionController.logout.bind(SessionController));

    this.sessionRouter.get(
      "/current",
      passport.authenticate("local", { session: false }),
      SessionController.getCurrentSession.bind(SessionController)
    );
  }

  getRouter() {
    return this.sessionRouter; 
  }
}

export default SessionRouter;

