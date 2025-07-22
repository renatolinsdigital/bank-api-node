# Logging

This document describes the logging system implemented in the Bank API application.

## Overview

The Bank API uses the Winston logging library to provide structured, configurable logging throughout the application. Logs are organized by date and contain detailed information about API operations, errors, and system events.

## Logging Configuration

The logging system is configured in `configs/logger.js`:

```typescript
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create log directory if it doesn't exist
const logDir = '../logs';
const currentDate = new Date().toLocaleDateString().split('/').join('-');
const logDirDate = path.join(__dirname, logDir, currentDate);

if (!fs.existsSync(logDirDate)) {
  fs.mkdirSync(logDirDate, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'bank-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [Bank API] ${level}: ${message}`;
        })
      )
    }),
    // File transport - daily log files
    new winston.transports.File({
      filename: path.join(logDirDate, `api-${currentDate}.log`),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

export default logger;
```

## Log Directory Structure

Logs are organized in daily directories:

```
logs/
├── DD-MM-YYYY/
│   └── api-DD-MM-YYYY.log
├── DD-MM-YYYY/
│   └── api-DD-MM-YYYY.log
```

## Log Levels

The application uses the following log levels (in order of increasing severity):

1. **debug** - Detailed debugging information
2. **info** - General operational information
3. **warn** - Warning events that might cause issues
4. **error** - Error events that might still allow the application to continue
5. **fatal** - Critical errors that force application shutdown

The log level can be configured via the `LOG_LEVEL` environment variable.

## Logging in the Application

### API Request Logging

All API requests are logged with relevant information:

```typescript
// Example from accountsRouter.ts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('GET /account');
    const allAccounts = await getAllAccounts();
    res.json(allAccounts);
  } catch (error) {
    next(error);
  }
});
```

### Error Logging

Errors are logged with detailed information:

```typescript
// Example from errorHandler.ts
if (err instanceof ApiError) {
  logger.error(`API Error: ${err.message} (${err.status})`);
  // ...
} else {
  logger.error(`Unexpected Error: ${err.message}`);
  logger.error(err.stack || '');
  // ...
}
```

### System Event Logging

System events like startup and shutdown are logged:

```typescript
// Example from main.ts
server.listen(port, () => {
  logger.info(`API started on port ${port}`);
  logger.info(`Swagger documentation available at http://localhost:${port}/swagger`);
});
```

## Log Format

The log format varies based on the transport:

### Console Logs

```
YYYY-MM-DDTHH:mm:ss.sssZ [Bank API] level: message
```

### File Logs

```json
{
  "level": "info",
  "message": "API started on port 8080",
  "service": "bank-api",
  "timestamp": "2025-07-22T12:34:56.789Z"
}
```

## Best Practices

1. **Use appropriate log levels** - Match the severity of the event with the correct log level
2. **Include context in log messages** - Add relevant details to make logs useful
3. **Avoid logging sensitive information** - Never log passwords, tokens, or personal data
4. **Log at entry and exit points** - Especially for external integrations
5. **Use structured logging** - Makes logs easier to search and analyze
6. **Configure logging based on environment** - Different detail levels for development vs. production
