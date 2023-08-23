import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/session.controller.js";

const sessionController = new SessionController();

class SessionRouter {
  constructor() {
    this.sessionRouter = Router();

    this.sessionRouter.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"] }),
      sessionController.handleGitHubCallback.bind(sessionController)
    );

    this.sessionRouter.get(
      "/githubcallback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      sessionController.handleGitHubCallback.bind(sessionController)
    );

    this.sessionRouter.get("/failregister", sessionController.failRegister.bind(sessionController));

    this.sessionRouter.post("/restartPassword", sessionController.restartPassword.bind(sessionController));

    this.sessionRouter.post("/register", sessionController.registerUser.bind(sessionController));

    this.sessionRouter.post(
      "/login",
      passport.authenticate("local"),
      sessionController.loginUser.bind(sessionController)
    );

    this.sessionRouter.post("/logout", sessionController.logout.bind(sessionController));

    this.sessionRouter.get(
      "/current",
      passport.authenticate("jwt", { session: false }),
      sessionController.getCurrentSession.bind(sessionController)
    );
  }

  getRouter() {
    return this.sessionRouter;
  }
}

export default new SessionRouter();
