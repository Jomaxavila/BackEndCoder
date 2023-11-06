import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["admin", "usuario", "premium"],
    default: "usuario",
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: Date,
});


const usersModel = mongoose.model(userCollection, userSchema);

export default usersModel;