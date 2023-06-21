import { Router } from "express";
import { uploader } from "../src/utils.js";

const router = Router();
const users = [];

router.get('/',(req,res)=>{
	res.send({users}) 
});

router.post('/',uploader.single('file'),function(req,res){
    console.log(req.file)
    if(!req.file){
        return res.status(400).send({status:"error", error:"No se guardo la imagen"})
    }
    let user =req.body;
    user.profile=req.file.path
    users.push(user)
    res.send({status:"Ok",message:"Usuario Creado"})
});