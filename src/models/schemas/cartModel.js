import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: {
        type: Number,
        default: 1 
      }
    }
  ]
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
