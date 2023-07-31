import passport from "passport";
import local from "passport-local";
import userModel from "../Dao/models/UsersModel.js";
import { createhast, isValidPassword } from "../utils.js";
import gitHubStrategy from "passport-github2"

 export const initPassport = () => {
  passport.use(
    "github",
    new gitHubStrategy(
      {
        clientID: "Iv1.b4d747ed99c2d832",
        clientSecret: "4b8b2d7d3703bdfc07ffa597d8ac392b833345de",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
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
};

const LocalStrategy = local.Strategy;
export const initializedPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createhast(password),
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error de usuaio" + error);
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


