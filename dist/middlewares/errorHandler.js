import ApiError from '../models/ApiError.js';
import logger from '../configs/logger.js';
const errorHandler = (err, _, res, next) => {
    logger.error(`Error: ${err.message}`);
    logger.debug(`Stack: ${err.stack}`);
    if (err instanceof ApiError) {
        res.status(err.status).send({ error: err.message });
        return;
    }
    if (err instanceof SyntaxError) {
        res.status(400).send({ error: 'Invalid JSON syntax' });
        return;
    }
    const errInternal = ApiError.internal();
    res.status(errInternal.status).send({ error: errInternal.message });
    next();
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map