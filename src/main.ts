import express from 'express';
import accountsRouter from './routes/accountsRouter';
import logger from './config/logger';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import * as dotenv from 'dotenv';
import { setInitialData } from './config/database';

// Load environment variables
dotenv.config();

// Set up constants
const port = parseInt(process.env.PORT || '8080', 10);
const server = express();

// Middleware setup
server.use(express.json());
server.use(express.static('public'));
server.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));

// Routes
server.use('/account', accountsRouter);
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/swagger.json',
  },
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Serve raw swagger spec as JSON
server.get('/swagger.json', (_: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
