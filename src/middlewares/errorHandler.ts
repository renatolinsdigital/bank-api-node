import { Request, Response } from 'express';
import ApiError from '../models/ApiError.js';
import logger from '../config/logger.js';

const errorHandler = (
  err: Error, 
  _: Request, 
  res: Response
): void => {
  logger.error(`Error: ${err.message}`);
  logger.debug(`Stack: ${err.stack}`);

  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON syntax' });
    return;
  }

  const errInternal = ApiError.internal();
  res.status(errInternal.status).json({ error: errInternal.message });
};

export default errorHandler;
