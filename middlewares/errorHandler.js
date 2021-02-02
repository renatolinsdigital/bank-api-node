import ApiError from '../models/ApiError.js';
import logger from '../configs/logger.js';

const errorHandler = (err, _, res, next) => {
  
  logger.error(err.message);

  if (err instanceof ApiError || err instanceof SyntaxError) {
    res.status(err.status).send({ error: err.message });
    return;
  }

  const errInternal = ApiError.internal();
  res.status(errInternal.status).send({ error: errInternal.message });

  next();

}

export default errorHandler;