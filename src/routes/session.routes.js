import { Router } from "express";
import userModel from "../Dao/models/UsersModel.js";
import { createhast } from "../utils.js";

const sessionRouter = Router();


sessionRouter.post('/register',async(req,res)=>{
  const { first_name, last_name, email, age, password} = req.body;
 if(!first_name || !last_name || !email || !age) return  res.status(400).send({status:"error",error:"Error User" });
 const user = {
     first_name,
     last_name,
     email,
     age,
     password: createhast(password)
 }
 let result = await userModel.create(user);
 res.send({status:"success",message:"User registered"});

})




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

sessionRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error al destruir la sesión:", err);
      return res.status(500).send({ status: "error", error: "Error al cerrar sesión" });
    }
    res.redirect("/login"); // Redirige al usuario a la página de login después de cerrar sesión
  });
});


export default sessionRouter;