
import { Router } from 'express';
import CartsRouter from './carts/carts.routes.js';
import ProductsRouter from './products/products.routes.js';
import SessionsRouter from './sessions/session.routes.js';
import TicketsRouter from './tickets/tickets.router.js';
import UserRouter from './users/users.routes.js';



const appRouter = Router();

appRouter.use('/carts', CartsRouter.getRouter());
appRouter.use('/products', ProductsRouter.getRouter());
appRouter.use('/session', SessionsRouter.getRouter());
appRouter.use('/users', UserRouter.getRouter());
appRouter.use('/tickets', TicketsRouter.getRouter());

export default appRouter;
