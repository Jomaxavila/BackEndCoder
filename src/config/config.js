import dotenv from "dotenv";
import params from "./params.js";

const mode = params.mode;

dotenv.config({
  path: `./.env.${mode}`,
});

const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  CLIENT_ID:process.env.CLIENT_ID,
  CLIENT_SECRET:process.env.CLIENT_SECRET,

};

console.log("SECRET_KEY:", CONFIG.SECRET_KEY);

export default CONFIG;
