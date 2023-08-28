import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import viewRouter from "./routes/views.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import sessionRouter from "./routes/session.routes.js";
import UserRouter from "./routes/users.routes.js"
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

const app = express();
const PORT = CONFIG.PORT || 8080; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);

mongoose.connect(CONFIG.MONGO_URI, { // Use MONGO_URI from CONFIG
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
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session())
app.engine("handlebars", exphbs.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter.getRouter());
app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/users", UserRouter.getRouter());

const server = httpServer.listen(PORT, () =>
  console.log(
    `Server started on port ${PORT} at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
