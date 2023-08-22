import dotenv from "dotenv"
import params from "./params.js"

const mode = params.mode;

dotenv.config({
	path:`./.env.${mode}`
})

export default {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	ADMIN_NAME: process.env.ADMIN_NAME,
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
	SECRET_KEY: process.env.SECRET_KEY
	
}