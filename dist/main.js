import express from 'express';
import accountsRouter from './routes/accountsRouter.js';
import { promises as fs } from 'fs';
import logger from './configs/logger.js';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setInitialData } from './configs/database.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const port = process.env.PORT || 8080;
const server = express();
const swaggerFilePath = path.join(__dirname, '..', 'src', 'swagger', 'swagger.json');
const swaggerContent = await fs.readFile(swaggerFilePath, { encoding: 'utf-8' });
const swaggerDocument = JSON.parse(swaggerContent);
server.use(express.json());
server.use(express.static('public'));
server.use(cors());
server.use('/account', accountsRouter);
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(errorHandler);
const init = async () => {
    try {
        await setInitialData();
        server.listen(port, () => {
            logger.info(`API started on port ${port}`);
            logger.info(`Swagger documentation available at http://localhost:${port}/swagger`);
        });
    }
    catch (err) {
        logger.error(`Failed to initialize server: ${err}`);
        process.exit(1);
    }
};
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    logger.error(error.stack || '');
    process.exit(1);
});
init();
//# sourceMappingURL=main.js.map