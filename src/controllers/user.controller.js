import UserService from "../services/users.service.js";
import { STATUS } from "../utilidades/constantes.js";


class UserController{
  
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const loginResult = await this.userController.login(email, password);

      res.cookie(loginResult.cookieOptions.name, loginResult.access_token, {
        maxAge: loginResult.cookieOptions.maxAge,
        httpOnly: loginResult.cookieOptions.httpOnly,
      });

      res.json({ payload: loginResult.payload });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

     
    async createUser(req,res){
        try{
            const data = req.body
            const response = await UserService.createUser(data)
            res.status(201).json({user:response,status:STATUS.SUCCESS})
        }catch(error){ 
            res.status(400).json({
                error:error.message,
                status:STATUS.FAIL
            })
        }
    }

    async getUser(req, res) {
      try {
          const { email } = req.body;
          const users = await UserService.getUser(email);
  
          if (users.length === 0) {
              res.status(404).json({ message: 'Usuario no encontrado' });
          } else {
              const user = users[0]; // Supongo que getUser(email) retorna un array de usuarios
              res.status(200).json({ user, status: STATUS.SUCCESS });
          }
      } catch (error) {
          res.status(400).json({
              error: error.message,
              status: STATUS.FAIL
          });
      }
  }
  
}

export default new UserController();
