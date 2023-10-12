import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import productsModel from "../../models/schemas/productModel.js";
import cartModel from "../../models/schemas/cartModel.js";

before(async () => {
  await mongoose.connect("mongodb+srv://jomaxavila:Fede1529@ecommerce.betvrpg.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  mongoose.connection.close();
});

export const dropProducts = async () => {
  await productsModel.collection.drop();
}

export const dropCarts = async () => {
  await cartModel.collection.drop();
}

export const setupTest = () => {
  const requester = supertest('http://localhost:8080');
  
  return requester;
};
