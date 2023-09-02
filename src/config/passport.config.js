import passport from "passport";
import local from "passport-local";
import { isValidPassword} from "../utils.js"
import GitHubStrategy from "passport-github2";
import userModel from "../models/schemas/usersModel.js";
import passportJWT, { ExtractJwt }from "passport-jwt";
import CONFIG from "./config.js";



const JwtStrategy = passportJWT.Strategy

export const initPassport = () => {
  passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CONFIG.SECRET_KEY,
  }, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  // Configuración de GitHub Strategy
  passport.use("github",new GitHubStrategy({
    clientID: "Iv1.b4d747ed99c2d832",
    clientSecret: CONFIG.CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              password: "",
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // Configuración de la estrategia de autenticación local
  const LocalStrategy = local.Strategy;
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user || !isValidPassword(user, password)) { 
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
  

};