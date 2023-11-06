import bcrypt from 'bcrypt';
import { generateToken } from '../utils.js'
import usersModel from '../models/schemas/usersModel.js';
import { UserResponseDTO } from '../models/dtos/users.dto.js';
import cartModel from '../models/schemas/cartModel.js';


class UserService{
  async login(email, password) {
    try {
        const user = await usersModel.findOne({ email }); 
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

    // Crear un nuevo usuario
    const user = await usersModel.create(data);

    // Crear un carrito vacío y asignarlo al usuario
    const newCart = new cartModel({
      products: [],
    });

    const cart = await newCart.save();

    // Asignar el ID del carrito al usuario
    user.cart = cart._id;
    await user.save();

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}


 


async getUser(uid) {
  try {
    const user = await usersModel.findById(uid).lean();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}


async getAllUsers() {
  try {
    const users = await usersModel.find();

    const usersDTO = users.map((user) => new UserResponseDTO(user));

    return {
      code: 202,
      status: "success",
      message: usersDTO,
    };
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.message);
    return {
      code: 500,
      status: "error",
      message: "Error al obtener los usuarios",
    };
  }
}


  async changeUserRole(newRole, uid) {
    try {
      if (newRole !== 'user' && newRole !== 'premium') {
        return { status: 'error', message: 'El nuevo rol no es válido' };
      }
      const user = await usersModel.findById(uid); 
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
      const user = await usersModel.findById(userId);
  
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
        name: documentType,
        reference: fullFilePath,
      });
  
      await user.save();
  
      return { status: 'success', message: 'Documento actualizado con éxito' };
    } catch (error) {
      console.error('Error al actualizar el documento del usuario:', error);
      return { status: 'error', message: 'Error al actualizar el documento del usuario' };
    }
  }
  

  async hasRequiredDocuments(uid) {
    try {
      const user = await usersModel.findById(uid);
  
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
      const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
      const documents = user.documents.map(doc => doc.type);
  
      for (const doc of requiredDocuments) {
        if (!documents.includes(doc)) {
          return false;
        }
      }
  
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  
}

export default new UserService();