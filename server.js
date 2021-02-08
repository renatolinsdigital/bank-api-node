import express from 'express';
import accountsRouter from './routes/accountsRouter.js';
import { promises as fs, existsSync } from 'fs';
import logger from './configs/logger.js';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
const { readFile, writeFile, mkdir } = fs;

dotenv.config();
const port = process.env.PORT;
const dataLocation = process.env.DATA_LOCATION;
const dataPath = process.env.DATA_PATH;
const server = express();
const swaggerDocument = JSON
  .parse(await readFile('./swagger/swagger.json', 'utf-8'));

server.use(express.json());
server.use(express.static('public'));
server.use(cors());
server.use('/account', accountsRouter);
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(errorHandler);

const setInitialData = async () => {
  try {
    const isDataPathSet = existsSync(dataPath);
    if (!isDataPathSet) await mkdir(dataPath);
    const isInitialDataSet = existsSync(dataLocation);
    if (!isInitialDataSet) {
      const initialData = JSON.stringify({ nextId: 1, accounts: [] });
      await writeFile(dataLocation, initialData);
      logger.info('Initial data created!');
    }
  }
  catch (err) {
    logger.error(err);
  }
};

const init = async () => {
  await setInitialData();
  server.listen(port, () => {
    logger.info(`API started on Port ${port}`);
  });
}

init();


