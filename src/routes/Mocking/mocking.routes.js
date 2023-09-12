import { Router } from 'express';
import {generateProduct} from "../../controllers/mocking.controller.js"


class MockingRouter {
  constructor() {
    this.mockingrouter = Router();

    this.mockingrouter.get('/', (req, res) => {
      const total = +req.query.total || 100;
      const products = Array.from({ length: total }, () => generateProduct());
      res.json({ success: true, payload: products });
      
    });
  }

  getRouter() {
    return this.mockingrouter;
  }
}

export default new MockingRouter();
