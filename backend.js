import {promises as fs} from "fs";

class productManager {
    constructor(){
        this.patch = "./productos.txt";
        this.products = [];
    }
    static id = 0

    addProduct = async (title, description, price, imagen, code, stock)=>{
      productManager.id++

        let newProduct = {
        title,
        description,
        price,
        imagen,
        code,
        stock,
        id:productManager.id
        };

        this.products.push(newProduct)

        await fs.writeFile (this.patch,JSON.stringify(this.products));
    };

    readProducts = async() => {
        let respuesta = await fs.readFile (this.patch, "utf-8")
        return JSON.parse(respuesta)
    }

    getProduct = async ()=>{
    let respuesta2 = await this.readProducts()
    return console.log(respuesta2);
    }

    getProductById = async (id) =>{
    let respuesta3 = await this.readProducts()
    if (!respuesta3.find(product => product.id ===id)){
        console.log("producto no encontrado")
    }else{
        console.log(respuesta3.find(product => product.id ===id))
        }
    };

    deleteProductById = async (id)=>{
        let respuesta3 = await this.readProducts();
        let productFilter = respuesta3.filter(products => products.id !=id)
        await fs.writeFile (this.patch,JSON.stringify(productFilter));
        console.log("Producto Eliminado")
    };

    updateProduts = async ({id, ...producto})=>{
        await this.deleteProductById(id); 
        let productOld = await this.readProducts()
        let productModif = [{...producto, id}, ...productOld];
        await fs.writeFile (this.patch,JSON.stringify(productModif));
            };
}

const productos = new productManager

// productos.addProduct("titulo1", "description","1000", "imagen", "ABC123", "5"); 
// productos.addProduct("titulo2", "description","2000", "imagen", "ABC456", "10"); 
// productos.addProduct("titulo3", "description","3000", "imagen", "ABC678", "15");
// productos.getProduct();

// productos.getProductById(5);

// productos.deleteProductById(2);
productos.updateProduts({
    title: 'titulo3',
    description: 'description',
    price: '4500',
    imagen: 'imagen',
    code: 'ABC678',
    stock: '15',
    id: 3,
});




