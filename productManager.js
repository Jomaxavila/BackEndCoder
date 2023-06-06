import { promises as fs } from "fs";

export default class productManager {
  constructor() {
    this.patch = "./productos.txt";
    this.products = [];
  }

  static id = 0;

  addProduct = async (title, description, price, imagen, code, stock) => {
    try {
      productManager.id++;

      // Validar los tipos de datos de los argumentos
      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof price !== "number" ||
        typeof imagen !== "string" ||
        typeof code !== "string" ||
        typeof stock !== "number"
      ) {
        throw new Error("Los tipos de datos de los argumentos son incorrectos.");
      }

      let newProduct = {
        title,
        description,
        price,
        imagen,
        code,
        stock,
        id: productManager.id,
      };

      this.products.push(newProduct);

      await fs.writeFile(this.patch, JSON.stringify(this.products));
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
    }
  };

  readProducts = async () => {
    try {
      let respuesta = await fs.readFile(this.patch, "utf-8");
      return JSON.parse(respuesta);
    } catch (error) {
      console.error("Error al leer los productos:", error.message);
      return [];
    }
  };

  getProduct = async () => {
    try {
      let respuesta2 = await this.readProducts();
      console.log(respuesta2);
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
    }
  };

  getProductById = async (id) => {
    try {
      let respuesta3 = await this.readProducts();
      if (!respuesta3.find((product) => product.id === id)) {
        console.log("Producto no encontrado");
      } else {
        console.log(respuesta3.find((product) => product.id === id));
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error.message);
    }
  };

  deleteProductById = async (id) => {
    try {
      let respuesta3 = await this.readProducts();
      let productFilter = respuesta3.filter((product) => product.id !== id);
      await fs.writeFile(this.patch, JSON.stringify(productFilter));
      console.log("Producto eliminado");
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
  };

  updateProducts = async ({ id, ...producto }) => {
    try {
      await this.deleteProductById(id);
      let productOld = await this.readProducts();
      let productModif = [{ ...producto, id }, ...productOld];
      await fs.writeFile(this.patch, JSON.stringify(productModif));
    } catch (error) {
      console.error("Error al actualizar los productos:", error.message);
    }
  };
}

const productos = new productManager();

// Ejemplo de uso
// productos.addProduct("titulo1", "description", 1000, "imagen", "ABC123", 5);
// productos.addProduct("titulo2", "description", 2000, "imagen", "DEF456", 3);
// productos.addProduct("titulo3", "description", 1500, "imagen", "GHI789", 7);
// productos.addProduct("titulo4", "description", 1800, "imagen", "JKL012", 2);
// productos.addProduct("titulo5", "description", 1200, "imagen", "MNO345", 4);
// productos.addProduct("titulo6", "description", 2500, "imagen", "PQR678", 6);
// productos.addProduct("titulo7", "description", 900, "imagen", "STU901", 8);
// productos.addProduct("titulo8", "description", 3000, "imagen", "VWX234", 1);
// productos.addProduct("titulo9", "description", 1700, "imagen", "YZA567", 9);
// productos.addProduct("titulo10", "description", 1400, "imagen", "BCD890", 4);


// productos.getProduct();

// productos.getProductById(1);
// productos.updateProducts({
//   title: "titulo3",
//   description: "description",
//   price: 4500,
//   imagen: "imagen",
//   code: "ABC678",
//   stock: 15,
// });
