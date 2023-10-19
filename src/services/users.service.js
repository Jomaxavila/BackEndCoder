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
  async changeUserRole(newRole, uid) {
    try {
      if (newRole !== 'user' && newRole !== 'premium') {
        return { status: 'error', message: 'El nuevo rol no es válido' };
      }
      const user = await userModel.findById(uid); 
      if (!user) {
        return { status: 'error', message: 'Usuario no encontrado' };
      }
      user.role = newRole;
      await user.save();

      return { status: 'success', message: 'Rol de usuario actualizado con éxito' };
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      return { status: 'error', message: 'Error al actualizar el rol del usuario' };
    }
  }

  async updateUserDocuments(userId, documentType, filePath) {
    try {
      const user = await userModel.findById(userId);
  
      console.log('User found:', user); 
  
      if (!user) {
        return { status: 'error', message: 'Usuario no encontrado' };
      }
  
      let folderType = '';
      if (documentType === 'profileImage') {
        folderType = 'profiles';
      } else if (documentType === 'productImage') {
        folderType = 'products';
      } else if (documentType === 'documents') {
        folderType = 'documents';
      }
  
      console.log('Folder type:', folderType); 
  
      const fullFilePath = `/public/uploads/${folderType}/${filePath}`;
  
      console.log('Full file path:', fullFilePath); 
  
      user.documents.push({
        type: documentType,
        path: fullFilePath,
      });
  
      await user.save();
  
      return { status: 'success', message: 'Documento actualizado con éxito' };
    } catch (error) {
      console.error('Error al actualizar el documento del usuario:', error);
      return { status: 'error', message: 'Error al actualizar el documento del usuario' };
    }
  }
  
  
}



export default new UserService();