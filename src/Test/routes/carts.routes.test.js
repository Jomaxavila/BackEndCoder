import { expect } from 'chai';
import { setupTest } from "./setup.test.js";


describe('Cart Routes', () => {
  const requester = setupTest();

  it('[POST] /api/carts - Create a cart', async () => {
    const response = await requester.post('/api/carts');

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.code).to.be.eql(200);
    expect(response.body.status).to.be.eql('success');
    expect(response.body.message).to.be.eql('Cart created successfully');
    expect(response.body.payload._id).to.be.ok;
  });



  it('[GET] /api/carts - Get all carts', async () => {
    const response = await requester.get('/api/carts');

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.code).to.be.eql(200);
    expect(response.body.status).to.be.eql('success');
    // Asegúrate de que la respuesta contenga la información de los carritos en el formato esperado
    expect(response.body.payload).to.be.an('array');
  });

  it('[GET] /api/carts/:id - Get a cart by ID', async () => {
    const response = await requester.get('/api/carts/6526ae6acd5e36f5c5f7b2cd');
  
    expect(response.statusCode).to.be.eql(202);
    expect(response.body.code).to.be.eql(202);
    expect(response.body.status).to.be.eql('Éxito');
    expect(response.body.message).to.be.an('array');
    expect(response.body.message).to.be.empty; 
  });
  
});
