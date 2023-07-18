import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import viewRouter from "./routes/views.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import websockets from "./websockets/websockets.js";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();
const PORT = 8080 || process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);
const config = {
  mongoDB: {
    URI: "mongodb+srv://jomaxavila:Fede1529@ecommerce.betvrpg.mongodb.net/?retryWrites=true&w=majority"
  }
};
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoDB.URI);
    console.log("Connected to Mongo Atlas");
  } catch (error) {
    console.log("Error en la conexión con Mongo Atlas", error);
  }
};

connectMongoDB();


  


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);



const server = httpServer.listen(PORT, () =>
  console.log(
    `Server started on port ${PORT} at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
