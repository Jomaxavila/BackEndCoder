    class ProductManager {
        constructor() {
        this.products = [];
        this.id = 0;
        }
    
        static id = 0;
    
        addProduct = (title, description, price, thumbnail, code, stock) => {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
            console.log(`El código ${code} está repetido`);
            break;
            }
        }
    
        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
    
        if (!Object.values(newProduct).includes(undefined)) {
            ProductManager.id++;
            this.products.push({
            ...newProduct,
            id: ProductManager.id,
            });
        } else {
            console.log("Todos los campos son requeridos");
        }
        };
    
        getProducts = () => {
        return this.products;
        };
    
        getProductByID = (id) => {
        if (!this.products.find((product) => product.id === id)) {
            console.log("Not Found");
        } else {
            console.log("Existe");
        }
        };
    }
    
    const products = new ProductManager();
    // pirmera llamada arreglo vacio
    console.log(products.getProducts());
    // Agregamos productos
    products.addProduct("India", "Paisaje de New Delhi", 1000, "imagen1", "IND123", 5);
    products.addProduct("Vietnam", "Paisaje de Vietnam", 2500, "imagen3", "VIE789", 9);

    // mostramos el Array con productos
    console.log(products.getProducts());

     // Validación con código repetido
     products.addProduct("New York", "Paisaje de Nueva York", 3000, "imagen4", "VIE789", 2);

    // Llamamos a un producto por el Id 2
    products.getProductByID(2);
    console.log("Se encuentra el producto solicitado con ID numero 2")
    
    // Llamamos a un producto por el Id no encontrado
    products.getProductByID(8);
    console.log("ID numero 8 no encontrado");
    
    // Intentando agregar sin atributo
    products.addProduct("Sudáfrica", "Paisaje de Sudáfrica", 2000, "SUD456", 3);
    