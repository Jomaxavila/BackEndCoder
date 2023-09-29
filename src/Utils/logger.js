import winston from "winston";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warn: 'yellow',
    info: 'blue',
    debug: 'white',
  }
};


const developmentLogger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug", 
      format: winston.format.combine(
        winston.format.colorize({ all: true, colors: levelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});


const productionLogger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.File({
      filename: './alertas.log',
      level: 'info',
      format: winston.format.simple(),
    }),
  ],
});


export const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.warn(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};


export { developmentLogger, productionLogger };
