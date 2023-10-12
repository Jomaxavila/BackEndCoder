import { expect } from "chai";

import { setupTest } from "./setup.test.js";

const requester = setupTest();

describe("Products Router Test Case", () => {
  it("[POST] /api/products - Crear un producto", async () => {
    const mockProduct = {
      title: "CAM MAX",
      description: "Cámara réflex de 35 mm lanzada en 1983",
      code: "NEW",
      price: 700,
      status: true,
      quantity: 5,
      thumbnail: "/images/camarasAntiguas7.jpg",
      owner: "6515748664cec3afbd868933",
      category: "modernas"
    };
    const response = await requester
      .post("/api/products")
      .send(mockProduct); 

    expect(response.statusCode).to.be.eql(201); 
    expect(response.body.status).to.be.eql("success");
    expect(response.body.payload.message).to.contain("ha sido agregado con éxito");
  });

  it("[GET] /api/products - Obtener todos los productos", async () => {
    const response = await requester.get("/api/products");

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.status).to.be.eql("success");
    expect(response.body.payload).to.be.an("object");
  });

  it("[GET] /api/products/:id - Obtener un producto por ID", async () => {
    const productoId = "6527e3a7e9bf2e0b99327fee"; 
    const response = await requester.get(`/api/products/${productoId}`);

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.status).to.be.eql("success");
    expect(response.body.payload).to.be.an("object");
  });
});
