import { Router } from "express";
import passport from "passport";
import { createhast } from "../utils.js";
import userModel from "../Dao/models/usersModel.js";


const sessionRouter = Router();

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get("/githubcallback",
  passport.authenticate('github',{ failureRedirect: '/login'}),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);



sessionRouter.get("/failregister", async (req, res) => {
  res.send({ error: "failed" });
});

sessionRouter.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete Values" });
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(404).send({ status: "error", error: "Not user found" });
  const newHashedPassword = createhast(password);
  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );

  res.send({ status: "success", message: "Contraseña restaurada" });
});

sessionRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      // Si el usuario ya existe, devolver error
      return res
        .status(400)
        .send({ status: "error", error: "El usuario ya existe" });
    }
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createhast(password), // Hashear la contraseña antes de guardarla en la base de datos
    };
    let result = await userModel.create(newUser);
    res.send({ status: "success", message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.log("Error en el registro:", error);
    res.status(500)
      .send({ status: "error", error: "Error al registrar usuario" });
  }
});

sessionRouter.post(
  "/login",
  passport.authenticate("local"),
  async (req, res) => {
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: "usuario", 
    };
    res.send({
      status: "success",
      payload: req.session.user,
      message: "Inicio de sesión exitoso",
    });
  }
);

sessionRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error al destruir la sesión:", err);
      return res
        .status(500)
        .send({ status: "error", error: "Error al cerrar sesión" });
    }
    res.redirect("/login");
  });
});

sessionRouter.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  const currentUser = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
  };
  res.json({ status: "success", user: currentUser });
});


export default sessionRouter;