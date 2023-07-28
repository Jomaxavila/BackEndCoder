import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt, {genSaltSync} from "bcrypt"

export const createhast = password=>bcrypt.hashSync(password,genSaltSync(10));
export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
 