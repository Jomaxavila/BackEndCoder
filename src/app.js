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
import loggerTestRoutes from "./routes/logger/loggerTest.routes.js";
import errorMiddle from "./middleware/indexControlError.js";
import { addLogger, logger } from "./Utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentacion de las APIs',
      description: 'Ecommerce de cámaras fotográficas antiguas',
      version: '1.0.0',
      contact: {
        name: "Avila Maxi",
        url: 'https://www.linkedin.com/in/maxiavila/'
      }
    }
  },
  apis: [
    `${__dirname}/docs/carts.yaml`,
    `${__dirname}/docs/products.yaml`,
  ],

};

const spec = swaggerJSDoc(swaggerOptions);

const app = express();
const PORT = CONFIG.PORT || 8080;


const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);

mongoose.connect(CONFIG.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info("Connected to Mongo Atlas");
  })
  .catch(error => {
    logger.error("Error en la conexión con Mongo Atlas", error);
  });

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
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
       ttl: 172800, // 2 días en segundos ,
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
app.use('/loggerTest',loggerTestRoutes.getRouter());
app.use(errorMiddle)
app.use(addLogger);

const server = httpServer.listen(PORT, () =>
  logger.info(`Server started on port ${PORT} at ${new Date().toLocaleString()}`)
);
server.on("error", (err) => logger.error(err));
