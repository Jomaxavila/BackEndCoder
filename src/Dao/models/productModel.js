import mongoose from "mongoose";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true }
});

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;
