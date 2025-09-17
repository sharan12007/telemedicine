const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);
  
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;