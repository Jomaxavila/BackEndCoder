import { Router } from 'express';
import { addLogger } from '../../Utils/logger.js';

class LoggerTestRouter {
  constructor() {
    this.loggerTestRouter = Router();

    this.loggerTestRouter.get('/', addLogger, (req, res) => {
      req.logger.info('Esto es un mensaje de información');
      req.logger.warning('Esto es un mensaje de advertencia');
      req.logger.debug('Esto es un mensaje de depuración');
      res.json({ message: 'Logs probados en /loggerTest' });
    });
  }

  getRouter() {
    return this.loggerTestRouter;
  }
}

export default new LoggerTestRouter();
