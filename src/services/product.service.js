import productsModel from "../models/schemas/productModel.js";


class ProductService {
  
  addProduct = async (newProduct) => {
    const product = {
      title: newProduct.title,
      description: newProduct.description,
      code: newProduct.code,
      price: newProduct.price,
      status: newProduct.status,
      stock: newProduct.stock,
      category: newProduct.category,
      thumbnail: newProduct.thumbnail,
      quantity: newProduct.quantity
    };
  
    const existingProduct = await productsModel.findOne({ code: product.code });
  
    if (existingProduct) {
      return {
        code: 400, 
        status: "error",
        message: `El código ${product.code} ya está en uso por otro producto.`,
      };
    }
  
    try {
      const result = await productsModel.create(product);
      return {
        code: 202,
        status: "success",
        message: `El producto ${product.title} ha sido agregado con éxito. Su id interno es ${product.id}`,
      };
    } catch (error) {
      return {
        code: 400,
        status: "error",
        message: `${error}`,
      };
    }
  };
  
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
        const result = await productsModel.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
          return { message: "Producto eliminado" };
        } else {
          return { message: "Producto no encontrado" };
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        return { error: "Error al eliminar el producto" };
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