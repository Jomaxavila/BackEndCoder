import productsModel from "../models/schemas/productModel.js";
import usersModel from "../models/schemas/usersModel.js";
import { sendDeletionProducts} from"../services/mailing.js"


class ProductService {
  
  async addProduct(newProduct) {
    const product = {
      title: newProduct.title,
      description: newProduct.description,
      code: newProduct.code,
      price: newProduct.price,
      status: newProduct.status,
      category: newProduct.category,
      thumbnail: newProduct.thumbnail,
      quantity: newProduct.quantity,
      owner: newProduct.owner,
    };

    const existingProduct = await productsModel.findOne({ code: product.code });

    if (existingProduct) {
      return {
        code: 400,
        status: 'error',
        message: `El código ${product.code} ya está en uso por otro producto.`,
      };
    }

    try {
      const result = await productsModel.create(product);
      return {
        code: 201,
        status: 'success',
        message: `El producto ${product.title} ha sido agregado con éxito. Su id interno es ${result._id}`,
        product: result,
      };
    } catch (error) {
      return {
        code: 400,
        status: 'error',
        message: error.message,
      };
    }
  }
  
  
    getProducts = async () => {
      try {
        const products = await productsModel.find();
        return {
        code: 202,
        status: "success",
        message: products
        };
      } catch (error) {
        console.error("Error al obtener los productos:", error.message);
        return {
        code: 500,
        status: "error",
        message: "Error al obtener los productos"
        };
      }
      };
      
    
      getProductById = async (id) => {
      try {
        const product = await productsModel.findById(id);
        if (!product) {
        return { message: "Producto no encontrado" };
        } else {
        return product;
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        return null;
      }
      };
      
    
  
      deleteProductById = async (id) => {
        try {
        
          const product = await productsModel.findById(id);
      
          if (!product) {
          
            throw new Error("Producto no encontrado");
          }
        
          const owner = await usersModel.findById(product.owner);
      
          if (owner && owner.role === 'premium') {
            await sendDeletionProducts(owner.email, owner, product)
            console.log("Correo enviado exitosamente.");
          } else {
            console.log("Propietario no es premium. No se enviará correo.");
          }
      
          const result = await productsModel.deleteOne({ _id: id });
          if (result.deletedCount === 1) {
            console.log("Producto eliminado exitosamente.");
            return { message: "Producto eliminado" };
          } else {
            console.log("Producto no encontrado al intentar eliminar.");
            throw new Error("Producto no encontrado al intentar eliminar");
          }
        } catch (error) {
          console.error("Error al eliminar el producto:", error.message);
          throw error; 
        }
      };
      


    updateProducts = async ({ id, ...producto }) => {
      try {
        await productsModel.updateOne({ _id: id }, { $set: producto });
        return { message: "Productos actualizados" };
      } catch (error) {
        console.error("Error al actualizar los productos:", error.message);
        return { error: "Error al actualizar los productos" };
      }
    };

    
    async getAllProducts(req, res) {
      try {
        const result = await productsModel.getAllProducts().lean();
        res.status(result.code).json({
          status: result.status,
          payload: result.message,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Error al obtener los productos",
        });
      }
    }
  }

export default new ProductService();