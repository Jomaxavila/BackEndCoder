import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import websockets from "./websockets/websockets.js";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import CONFIG from "./config/config.js";
import appRouter from "./routes/app.router.js";
import cors from 'cors';
import ViewsRouter from "./routes/views/views.routes.js";
import Mockingrouter from "./routes/Mocking/mocking.routes.js";
import errorMiddle from "./middleware/indexControlError.js"

const app = express();
const PORT = CONFIG.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);

mongoose.connect(CONFIG.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to Mongo Atlas");
  })
  .catch(error => {
    console.log("Error en la conexión con Mongo Atlas", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "12345abcd",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: CONFIG.MONGO_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 3600,
    }),
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session())
app.engine("handlebars", exphbs.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(cookieParser())
app.use(cors({
  origin: 'http://127.0.0.1:5580', 
  methods: ['GET', 'POST', 'PUT'] 
}));
app.use ('/api', appRouter)
app.use('/',ViewsRouter.getRouter())
app.use('/mockingproducts', Mockingrouter.getRouter());
app.use(errorMiddle)



const server = httpServer.listen(PORT, () =>
  console.log(
    `Server started on port ${PORT} at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
