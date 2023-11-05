import mongoose from "mongoose";
const sessionCollection = "sessions";
const sessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  session: {
    type: String,
    required: true
  }
});
const sessionModel = mongoose.model(sessionCollection, sessionSchema);
export default sessionModel;