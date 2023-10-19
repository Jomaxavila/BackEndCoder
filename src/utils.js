import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt, { genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import CONFIG from "./config/config.js";



const SECRET_KEY = CONFIG.SECRET_KEY || "top_secret_07"; 

export const generateToken = (user) => {
  const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "12h" });
  return token;
};

export const authToken = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  if (!headerAuth) return res.status(401).send({ status: "error", error: "No esta autorizado" });
  console.log(headerAuth);
  const token = headerAuth.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (error, credentials) => { // Cambia "KEY" por "SECRET_KEY"
    console.log(error);
    if (error) return res.status(401).send({ status: "error", error: "No esta autorizado" });
    req.user = credentials.user;
    next();
  });
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["maxcookie7"];
  }
  return token;
};

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderType = '';

    if (file.fieldname === 'profileImage') {
      folderType = 'profileImage';
    } else if (file.fieldname === 'productImage') {
      folderType = 'productImage';
    } else if (file.fieldname === 'documents') {
      folderType = 'documents';
    }

    cb(null, `src/public/uploads/${folderType}/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });

export default upload;

