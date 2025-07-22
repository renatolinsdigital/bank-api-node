# Express Implementation

This document outlines how Express.js is used in the Bank API application.

## Overview

The Bank API uses Express.js as its web framework for handling HTTP requests, routing, middleware, and error handling. Express was chosen for its simplicity, flexibility, and widespread adoption in the Node.js ecosystem.

## Express Server Setup

The Express server is initialized in `main.ts`:

```typescript
import express from 'express';
import accountsRouter from './routes/accountsRouter';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';

// Initialize Express
const server = express();

// Middleware setup
server.use(express.json());
server.use(express.static('public'));
server.use(cors());

// Routes
server.use('/account', accountsRouter);
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
server.use(errorHandler);

// Start server
server.listen(port, () => {
  logger.info(`API started on port ${port}`);
  logger.info(`Swagger documentation available at http://localhost:${port}/swagger`);
});
```

## Middleware Stack

The application uses the following Express middleware:

### Built-in Middleware

1. **express.json()** - Parses incoming requests with JSON payloads
2. **express.static('public')** - Serves static files from the public directory

### Third-party Middleware

1. **cors()** - Enables Cross-Origin Resource Sharing
2. **swaggerUi.serve** - Serves Swagger UI assets

### Custom Middleware

1. **errorHandler** - Global error handling middleware

## Routing

Routes are defined in dedicated router files in the `routes` directory:

```typescript
// Example from accountsRouter.ts
import express, { Request, Response, NextFunction } from 'express';
import { getAllAccounts, getAccountById /* ... */ } from '../controllers/accountsController';

const router = express.Router();

// GET all accounts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('GET /account');
    const allAccounts = await getAllAccounts();
    res.json(allAccounts);
  } catch (error) {
    next(error);
  }
});

// GET account by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    logger.info(`GET /account/${id}`);
    const account = await getAccountById(id);
    res.json(account);
  } catch (error) {
    next(error);
  }
});

// More routes...

export default router;
```

## Request Processing Flow

1. Request arrives at the Express server
2. Express middleware processes the request in order:
   - JSON body parsing
   - Static file serving
   - CORS handling
3. Request is routed to the appropriate router based on the URL path
4. Router handler is executed:
   - Request parameters are extracted
   - Logging is performed
   - Controller method is called
   - Response is sent
5. If an error occurs, it's passed to the error handling middleware

## Error Handling

Express's error handling middleware is used to catch and process errors:

```typescript
// From middlewares/errorHandler.ts
const errorHandler = (
  err: Error, 
  _: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    logger.error(`API Error: ${err.message} (${err.status})`);
    res.status(err.status).json({
      error: true,
      message: err.message
    });
  } else {
    logger.error(`Unexpected Error: ${err.message}`);
    logger.error(err.stack || '');
    res.status(500).json({
      error: true,
      message: 'Internal server error.'
    });
  }
};
```

## Response Handling

The application uses standard Express response methods:

1. **res.json()** - Sends a JSON response
2. **res.status()** - Sets the HTTP status code
3. **res.send()** - Sends a generic response

## API Documentation

Swagger UI is integrated using the `swagger-ui-express` package:

```typescript
import swaggerUi from 'swagger-ui-express';

// Load Swagger document
const swaggerFilePath = path.join(__dirname, '..', 'src', 'swagger', 'swagger.json');
const swaggerContent = await fs.readFile(swaggerFilePath, { encoding: 'utf-8' });
const swaggerDocument = JSON.parse(swaggerContent);

// Setup Swagger UI
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## TypeScript Integration

Express is used with TypeScript to provide type safety:

```typescript
import express, { Request, Response, NextFunction } from 'express';

// Using TypeScript types with Express
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAccount: Account = req.body;
    // ...
  } catch (error) {
    next(error);
  }
});
```

## Best Practices

1. **Modular routing** - Keep routes organized in separate files
2. **Consistent error handling** - Use the error middleware for all errors
3. **Controller separation** - Keep business logic in controllers, not routes
4. **Middleware order** - Pay attention to the order of middleware registration
5. **Async/await with try/catch** - Always wrap async code in try/catch blocks
6. **Type safety** - Use TypeScript types for request and response objects
7. **Logging** - Log all requests and responses for debugging
