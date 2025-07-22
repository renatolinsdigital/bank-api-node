import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (err: Error, _: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
