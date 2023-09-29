import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  code: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  quantity: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    default: "admin",
    validate: {
      validator: async function (value) {
        const user = await mongoose.model("users").findById(value);
        if (user && (user.role === "premium" || user.role === "admin")) {
          return true;
        } else {
          return false;
        }
      },
      message: 'El propietario debe ser un usuario premium o admin.',
    },
  },
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;
