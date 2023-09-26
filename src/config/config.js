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
  MAILING_USER:process.env.CLIENT_SECRET,
  MAILING_PASSWORD:process.env.MAILING_PASSWORD,
  MAILING_SERVICE:process.env.MAILING_SERVICE,
  APP_URL:process.env.APP_URL

};


export default CONFIG;
