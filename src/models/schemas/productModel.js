import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  quantity: { type: Number, required: true },
  owner: {
    type: String, 
    ref: 'User', 
    default: 'admin',
    validate: {
      validator: async function (value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'premium';
      },
      message: 'El propietario debe ser un usuario premium.',
    },
  },
});
productSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;
