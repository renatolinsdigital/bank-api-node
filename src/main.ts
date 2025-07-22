import express from 'express';
import accountsRouter from './routes/accountsRouter';
import { promises as fs } from 'fs';
import logger from './configs/logger';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setInitialData } from './configs/database';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Set up constants
const port = process.env.PORT || 8080;
const server = express();

// Load Swagger document
const swaggerFilePath = path.join(__dirname, '..', 'src', 'swagger', 'swagger.json');
const swaggerContent = await fs.readFile(swaggerFilePath, { encoding: 'utf-8' });
const swaggerDocument = JSON.parse(swaggerContent);

// Middleware setup
server.use(express.json());
server.use(express.static('public'));
server.use(cors());

// Routes
server.use('/account', accountsRouter);
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
server.use(errorHandler);

/**
 * Initializes the application
 */
const init = async (): Promise<void> => {
  try {
    // Set up initial data
    await setInitialData();
    
    // Start server
    server.listen(port, () => {
      logger.info(`API started on port ${port}`);
      logger.info(`Swagger documentation available at http://localhost:${port}/swagger`);
    });
  } catch (err) {
    logger.error(`Failed to initialize server: ${err}`);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack || '');
  process.exit(1);
});

// Initialize the server
init();
