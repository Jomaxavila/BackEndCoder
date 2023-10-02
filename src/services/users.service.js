import bcrypt from 'bcrypt';
import { generateToken } from '../utils.js'
import userModel from '../models/schemas/usersModel.js';


class UserService{
  async login(email, password) {
    try {
        const user = await userModel.findOne({ email }); 
        if (user && bcrypt.compareSync(password, user.password)) {
            const role = user.role === 'admin' ? 'admin' : 'usuario';
            const access_token = generateToken({ email, role });

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


  async createUser(data, role) {
    try {
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        data.role = role;
        const response = await userModel.create(data);
        return response;
    } catch (error) {
        throw new Error(error.message);
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
  async changeUserRole(uid, newRole) {
    try {
      // Validar que el nuevo rol sea "user" o "premium"
      if (newRole !== 'user' && newRole !== 'premium') {
        return { status: 'error', message: 'El nuevo rol no es válido' };
      }
  
      // Buscar al usuario por su ID (uid)
      const user = await userModel.findById(uid);
  
      // Validar que el usuario exista
      if (!user) {
        return { status: 'error', message: 'Usuario no encontrado' };
      }
  
      // Actualizar el rol del usuario en la base de datos
      user.role = newRole;
      await user.save();
  
      return { status: 'success', message: 'Rol de usuario actualizado con éxito' };
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      return { status: 'error', message: 'Error al actualizar el rol del usuario' };
    }
  }
  
}

export default new UserService();