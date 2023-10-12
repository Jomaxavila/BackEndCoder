import { expect } from "chai";
import { dropProducts, setupTest } from "./setup.test.js";

const requester = setupTest();

describe("Products Router Test Case", () => {
  before(async () => {
    await dropProducts();
  });

  it("[POST] /api/products - Crear un producto", async () => {
    const mockProduct = {
      title: "Producto de prueba",
      description: "Descripción del producto",
      code: "12345",
      price: 19.99,
      status: "Disponible",
      category: "Categoría de prueba",
      thumbnail: "URL de la imagen",
      quantity: 10,
      owner: "Propietario de prueba",
    };
    const response = await requester.post("/api/products").send(mockProduct);

    // Cambia esta afirmación de 400 a 201
    expect(response.statusCode).to.be.eql(201);
    expect(response.body.status).to.be.eql("success");
    expect(response.body.payload.message).to.contain("Producto de prueba ha sido agregado con éxito");
  });

  it("[GET] /api/products - Obtener todos los productos", async () => {
    const response = await requester.get("/api/products");

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.status).to.be.eql("success");
    // Cambia esta afirmación para verificar que response.body.payload sea un objeto (no un array)
    expect(response.body.payload).to.be.an('object');
  });

  it("[GET] /api/products/:id - Obtener un producto por ID", async () => {
    const productoId = "65271a6a56b42f59e5127d25";
    const response = await requester.get(`/api/products/${productoId}`);

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.status).to.be.eql("success");
    expect(response.body.payload).to.be.an('object');
  });
});
