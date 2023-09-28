import { Router } from "express";
import passport from "passport";
import SessionController from "../../controllers/session.controller.js";

class SessionsRouter {
  constructor() {
    this.sessionsRouter = Router();

    this.sessionsRouter.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"] }),
      SessionController.handleGitHubCallback.bind(SessionController)
    );

    this.sessionsRouter.get(
      "/githubcallback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      SessionController.handleGitHubCallback.bind(SessionController)
    );

    this.sessionsRouter.get("/failregister", SessionController.failRegister.bind(SessionController));

    this.sessionsRouter.post("/restartPassword", SessionController.restartPassword.bind(SessionController));

    this.sessionsRouter.post("/register", SessionController.registerUser.bind(SessionController));

    this.sessionsRouter.post(
      "/login",
      passport.authenticate("local"),
      SessionController.loginUser.bind(SessionController)
    );

    this.sessionsRouter.post("/logout", SessionController.logout.bind(SessionController));

    this.sessionsRouter.get(
      "/current",
      passport.authenticate("local", { session: false }),
      SessionController.getCurrentSession.bind(SessionController)
    );

    this.sessionsRouter.post(
      "/send-reset-email",
      SessionController.sendResetMail.bind(SessionController)
    );
  }

  getRouter() {
    return this.sessionsRouter;
  }
}

export default new SessionsRouter();
