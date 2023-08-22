import bcrypt from 'bcrypt';
import { generateToken } from '../utils.js'
import userModel from '../Dao/models/usersModel.js'


class userService{
  async login(email, password) {
    try {
      if (email === "jomaxavila@gmail.com" && bcrypt.compareSync(password, "1234")) {
        const access_token = generateToken({ email, role: 'admin' });

        return {
          access_token,
          cookieOptions: {
            name: 'maxcookie7',
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
          },
          payload: 'OK',
        };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUser(data){
    try{
      data.password = bcrypt.hashSync(data.password,bcrypt.genSaltSync(10))
      const response = await userModel.create(data)
      return response

    }catch(error){
       throw new Error(error.message)
    }
  }

  async getUser(email){
    try{
      const response = await userModel.find({email}).lean()

      return response

    }catch (error){
      throw new Error(error.message) 

    }
  }
}

export default new userService();