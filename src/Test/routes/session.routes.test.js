import { expect } from 'chai';
import { setupTest } from "./setup.test.js";

describe('Session Routes - Register', () => {
  const requester = setupTest();

  it('[POST] /api/session/register - Sign up a user successfully', async () => {
    const mockUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      age: 30 
    };

    const response = await requester
      .post('/api/session/register')
      .send(mockUser);

    expect(response.statusCode).to.equal(200);
  });

  it('[POST] /api/session/register - Sign up with incomplete data', async () => {
    const incompleteUser = {
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
    };

    const response = await requester
      .post('/api/session/register')
      .send(incompleteUser);

    expect(response.statusCode).to.equal(400);
  });

  it('[POST] /api/session/login - User login', async () => {
    const loginUser = {
      email: "johndoe@example.com",
      password: "password123",
    };

    const response = await requester
      .post('/api/session/login')
      .send(loginUser);

    expect(response.statusCode).to.equal(200);
  });

  it('[POST] /api/session/restartPassword - Restart password successfully', async () => {
    const passwordData = {
      email: "johndoe@example.com",
      newPassword: "newpassword123",
    };

    const response = await requester
      .post('/api/session/restartPassword')
      .send(passwordData);

    expect(response.statusCode).to.equal(200);
  });

  it('[POST] /api/session/restartPassword - Restart password with incomplete data', async () => {
    const incompletePasswordData = {
      email: "johndoe@example.com",
    };

    const response = await requester
      .post('/api/session/restartPassword')
      .send(incompletePasswordData);

    expect(response.statusCode).to.equal(400);
  });
});
