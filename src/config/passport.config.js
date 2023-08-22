import passport from "passport";
import local from "passport-local";
import { isValidPassword} from "../utils.js"
import GitHubStrategy from "passport-github2";
import userModel from "../Dao/models/usersModel.js";
import passportJWT, { ExtractJwt }from "passport-jwt";



const SECRET_KEY= "top_secret_07"
const JwtStrategy = passportJWT.Strategy



export const initPassport = () => {
  passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY
  }, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id); // Cambia 'id' por el campo correcto en tu modelo
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
    clientSecret: "b9332a7a9eb77c5cec78137e0b3c98458d41eae0",
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
            // Si el usuario no existe o la contraseña no es válida, devolver error
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          // Si el usuario y la contraseña son válidos, devolver el usuario
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