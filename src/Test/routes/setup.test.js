import supertest from "supertest";
import mongoose from "mongoose";


before(async () => {
  await mongoose.connect("mongodb+srv://jomaxavila:Fede1529@ecommerce.betvrpg.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  mongoose.connection.close();
});

export const setupTest = () => {
  const requester = supertest('http://localhost:8080');
  
  return requester;
};
