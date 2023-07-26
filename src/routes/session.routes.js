import { Router } from "express";
import userModel from "../Dao/models/UsersModel.js";

const sessionRouter = Router();

// Registrar un nuevo usuario
sessionRouter.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await userModel.findOne({ email });

  if (exist) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
    role: "usuario"
  };

  let result = await userModel.create(user);
  res.send({ status: "success", message: "Usuario registrado" });
});



sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let role = "usuario"; 

  if (email === "adminCoder@coder.com" && password === "coder1234") {
    role = "admin"; 
  }

  const user = await userModel.findOne({ email, password });

  if (!user) {
    return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
  }

  console.log("Usuario encontrado:", user);

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: role 
  };

  console.log("Usuario en sesión:", req.session.user);

  res.send({ status: "success", payload: req.session.user, message: "Inicio de sesión exitoso" });
});


export default sessionRouter;