import { Router } from 'express';
import TicketsController from '../../controllers/tickets.controller.js';

class TicketsRouter {
  constructor() {
    this.router = Router();

    this.router.get('/', TicketsController.getTickets);
    this.router.get('/:id', TicketsController.getTicketById);
    this.router.post('/', TicketsController.createTicket);
    this.router.put('/:id', TicketsController.resolveTicket);
  }

  getRouter() {
    return this.router;
  }
}

export default new TicketsRouter();
