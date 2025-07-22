# API Endpoints

This document provides detailed information about the API endpoints in the Bank API application.

## Base URL

All endpoints are relative to the base URL:

```
http://localhost:8080
```

## Authentication

The current implementation does not include authentication. In a production environment, appropriate authentication mechanisms should be implemented.

## Response Format

All responses are in JSON format. Successful responses typically return the requested data or a success indicator. Error responses follow a consistent format:

```json
{
  "error": true,
  "message": "Error message details"
}
```

## Endpoints

### Account Management

#### Get All Accounts

Retrieves a list of all accounts.

- **URL**: `/account`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "nextId": 11,
      "accounts": [
        {
          "id": 1,
          "name": "Renato Lins",
          "balance": 10000.50
        },
        {
          "id": 2,
          "name": "Alice Johnson",
          "balance": 5280.75
        }
        // More accounts...
      ]
    }
    ```

#### Get Account by ID

Retrieves a specific account by ID.

- **URL**: `/account/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id` - The ID of the account to retrieve
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "Renato Lins",
      "balance": 10000.50
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the ID is not a valid number
  - **Code**: 404 - If the account is not found

#### Create Account

Creates a new account.

- **URL**: `/account`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "New User",
    "balance": 1000
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "id": 11,
      "name": "New User",
      "balance": 1000
    }
    ```
- **Error Response**:
  - **Code**: 400 - If the request data is invalid

#### Update Account

Updates an existing account.

- **URL**: `/account`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "id": 1,
    "name": "Updated Name",
    "balance": 2000
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "Updated Name",
      "balance": 2000
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the request data is invalid
  - **Code**: 404 - If the account is not found

#### Delete Account

Deletes an account by ID.

- **URL**: `/account/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id` - The ID of the account to delete
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "success": true
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the ID is not a valid number
  - **Code**: 404 - If the account is not found

### Account Operations

#### Withdraw from Account

Withdraws funds from an account.

- **URL**: `/account/withdraw/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id` - The ID of the account
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "Renato Lins",
      "balance": 9500.50
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the request data is invalid
  - **Code**: 403 - If there are not enough funds
  - **Code**: 404 - If the account is not found

#### Deposit to Account

Deposits funds to an account.

- **URL**: `/account/deposit/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id` - The ID of the account
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "Renato Lins",
      "balance": 10500.50
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the request data is invalid
  - **Code**: 404 - If the account is not found

#### Transfer Between Accounts

Transfers funds between two accounts.

- **URL**: `/account/transfer`
- **Method**: `PATCH`
- **Query Parameters**:
  - `fromAccountWithId` - The ID of the source account
  - `toAccountWithId` - The ID of the destination account
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "fromAccount": {
        "id": 1,
        "name": "Renato Lins",
        "balance": 9500.50
      },
      "toAccount": {
        "id": 2,
        "name": "Alice Johnson",
        "balance": 5780.75
      }
    }
    ```
- **Error Responses**:
  - **Code**: 400 - If the request data is invalid
  - **Code**: 403 - If there are not enough funds
  - **Code**: 404 - If either account is not found

## API Documentation

The API is documented using OpenAPI 3.0 (Swagger) and is available at:

```
http://localhost:8080/swagger
```

This documentation provides an interactive UI for exploring and testing the API endpoints.

## Implementation Details

All API endpoints are implemented in the `routes/accountsRouter.ts` file, with business logic in the `controllers/accountsController.ts` file.

The router uses Express.js to define the routes and handle HTTP requests, while the controller implements the business logic and interacts with the data layer.
