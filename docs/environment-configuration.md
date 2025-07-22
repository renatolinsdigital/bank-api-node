# Environment Configuration

This document describes the environment configuration approach in the Bank API application.

## Overview

The Bank API uses environment variables for configuration, allowing different settings for development, testing, and production environments. The `dotenv` package is used to load environment variables from a `.env` file.

## Environment Variables

The application uses the following environment variables:

| Variable       | Description                               | Default Value                      |
|----------------|-------------------------------------------|-----------------------------------|
| `PORT`         | The port on which the server listens      | `8080`                            |
| `LOG_LEVEL`    | The minimum level of logs to record       | `info`                            |
| `DATA_PATH`    | Directory path for data storage           | `<project_root>/data`             |
| `DATA_LOCATION`| Full path to the accounts data file       | `<DATA_PATH>/accounts.json`       |
| `NODE_ENV`     | The environment (development/production)  | `development`                     |

## Environment Files

### .env.example

The repository includes a `.env.example` file with default values that can be used as a template:

```env
PORT=8080
LOG_LEVEL=info
NODE_ENV=development
# DATA_PATH and DATA_LOCATION are optional and have default values
```

### .env

The actual configuration is stored in a `.env` file, which is not committed to the repository for security reasons. The application includes a script to create this file from the example:

```bash
npm run prepare-env
```

This script runs the following code:

```javascript
if (!fs.existsSync('.env')) fs.copyFileSync('.env.example', '.env');
```

## Loading Environment Variables

Environment variables are loaded in the main application file:

```typescript
// From main.ts
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use environment variables
const port = process.env.PORT || 8080;
```

## Environment-specific Behavior

The application can adjust its behavior based on the environment:

```typescript
// Example of environment-specific behavior
if (process.env.NODE_ENV === 'development') {
  // Development-specific configuration
  logger.level = 'debug';
} else {
  // Production configuration
  logger.level = process.env.LOG_LEVEL || 'info';
}
```

## Default Values

Default values are provided for all environment variables to ensure the application can run even if the environment is not fully configured:

```typescript
// Example of using a default value
const port = process.env.PORT || 8080;
const logLevel = process.env.LOG_LEVEL || 'info';
const dataPath = process.env.DATA_PATH || path.join(__dirname, '..', '..', 'data');
```

## Security Considerations

- The `.env` file is excluded from version control in `.gitignore`
- Sensitive information should be stored in environment variables, not in code
- Different environment files should be used for different environments (development, testing, production)
- In production, environment variables should be set on the server or in a secure environment management system

## Best Practices

1. **Use .env.example** - Provide an example configuration file with default values
2. **Don't commit .env** - Keep actual configuration out of version control
3. **Provide defaults** - Always have fallback values for environment variables
4. **Validate configuration** - Check that required variables are present and valid
5. **Document variables** - Clearly document all environment variables and their purpose
6. **Separate environments** - Use different configurations for development, testing, and production
