# Error Handling

This document describes the error handling approach in the Bank API application.

## Overview

The Bank API implements a robust error handling mechanism that provides consistent error responses, detailed logging, and proper HTTP status codes. This ensures that clients receive clear error messages and developers can easily troubleshoot issues.

## Error Types

### 1. ApiError

The application uses a custom `ApiError` class defined in `models/ApiError.ts`. This class extends the native `Error` class and adds HTTP status code information.

```typescript
class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }

  // Static factory methods for common errors
  static badRequest(): ApiError {
    return new ApiError(400, ERROR_BAD_REQUEST);
  }

  static notEnoughFunds(): ApiError {
    return new ApiError(403, ERROR_NOT_ENOUGH_FUNDS);
  }

  static notFound(): ApiError {
    return new ApiError(404, ERROR_NOT_FOUND);
  }

  static internal(): ApiError {
    return new ApiError(500, ERROR_INTERNAL);
  }
}
```

### 2. Standard Error Messages

Error messages are centralized in `configs/userErrorMessages.ts`:

```typescript
// Example of error message constants
export const ERROR_BAD_REQUEST = 'Invalid data format.';
export const ERROR_NOT_ENOUGH_FUNDS = 'Not enough funds for this operation.';
export const ERROR_NOT_FOUND = 'Account not found.';
export const ERROR_INTERNAL = 'Internal server error.';
```

## Error Handling Middleware

The application uses a global error handling middleware defined in `middlewares/errorHandler.ts`. This middleware catches all errors thrown during request processing and formats them into a consistent response:

```typescript
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

## Error Handling in Controllers

In controller methods, errors are caught and processed based on their type:

1. **Validation Errors** - Thrown when request data is invalid (400 Bad Request)
2. **Not Found Errors** - Thrown when requested resources don't exist (404 Not Found)
3. **Business Logic Errors** - Thrown when operations violate business rules (e.g., 403 Forbidden)
4. **Internal Errors** - Unexpected errors during processing (500 Internal Server Error)

Example from accountsController.ts:

```typescript
export const getAccountById = async (id: string | number): Promise<AccountWithId> => {
  const accountId = Number(id);

  if (isNaN(accountId)) throw ApiError.badRequest();

  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);

  if (!isEveryIdValid) throw ApiError.notFound();

  const queriedAccount = accountsFullJson.accounts
    .find(account => account.id === accountId);

  return queriedAccount as AccountWithId;
}
```

## Error Response Format

All error responses follow a consistent JSON format:

```json
{
  "error": true,
  "message": "Error message details"
}
```

## Error Logging

All errors are logged using the Winston logger:

1. **API Errors** - Logged with error level, including status code
2. **Unexpected Errors** - Logged with error level, including stack trace

## Best Practices

1. **Use ApiError for known error conditions** - This ensures proper status codes and consistent messages
2. **Let the global error handler catch unexpected errors** - Provides a safety net for unhandled errors
3. **Include relevant context in error messages** - Helps with debugging and troubleshooting
4. **Validate inputs early** - Catch invalid inputs before they reach business logic
5. **Use try/catch blocks for async operations** - Ensures errors are properly caught and processed
