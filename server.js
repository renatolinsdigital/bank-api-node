import express from 'express';
import accountsRouter from './routes/accountsRouter.js';
import { promises as fs, existsSync } from 'fs';
import './configs/global-consts.js';
import './configs/logger.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
const { readFile, writeFile, mkdir } = fs;

// Server config

const PORT = 8080;
const server = express();
const swaggerDocument = JSON.parse(await readFile('./swagger/swagger.json', 'utf-8'));

server.use(express.json());
server.use(express.static('public'));
server.use(cors());
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes attaching

server.use('/account', accountsRouter);

// Init

const setInitialData = async () => {
  try {
    const isDataPathSet = existsSync(DATA_PATH);
    if (!isDataPathSet) await mkdir(DATA_PATH);
    const isInitialDataSet = existsSync(DATA_LOCATION);
    if (!isInitialDataSet) {
      const initialData = JSON.stringify({ nextId: 1, accounts: [] });
      await writeFile(DATA_LOCATION, initialData);
      logger.info('Initial data created!');
    }
  }
  catch (err) {
    logger.error(err);
  }
};

const initServer = () => {
  setInitialData();
  logger.info(`API started on Port ${PORT}`);
}

server.listen(PORT, initServer);
