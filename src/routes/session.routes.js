import { Router } from "express";
import passport from "passport";
import userModel from "../Dao/models/UsersModel.js";
import { createhast } from "../utils.js";

const sessionRouter = Router();

sessionRouter.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{
 
})
 
sessionRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user=req.user
    res.redirect('/')
})

sessionRouter.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}), async(req,res)=>{
res.send({status:"success", message:"User Register"})
})

sessionRouter.get('/failregister', async(req,res)=>{
  res.send({error:"failed"})
})


sessionRouter.post('/restartPassword',async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  const user = await userModel.findOne({email});
  if(!user) return res.status(404).send({status:"error",error:"Not user found"});
  const newHashedPassword = createhast(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});

  res.send({status:"success",message:"Contraseña restaurada"});
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
    res.redirect("/login");
  });
});


export default sessionRouter;