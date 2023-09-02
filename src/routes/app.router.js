import {Router} from 'express'
import CartsRouter from './carts/carts.routes.js';
import ProductsRouter from './products/products.routes.js';
import SessionRouter from './sessions/session.routes.js';
import UserRouter from './users/users.routes.js';
import ViewsRouter from './views/views.routes.js';
 
const appRouter = Router();
 
appRouter.use('/carts', new CartsRouter().getRouter());
appRouter.use('/products', new ProductsRouter().getRouter());
appRouter.use('/session', new SessionRouter().getRouter());
appRouter.use('/users', new UserRouter().getRouter());
appRouter.use('/views', new ViewsRouter().getRouter());
 
export default appRouter;
