# Application Architecture

This document outlines the architecture of the Bank API application.

## Overview

The Bank API follows a modular, layered architecture pattern that separates concerns and promotes maintainability and testability. The application is built using TypeScript and Express.js, with a focus on type safety and clear separation of responsibilities.

## Architectural Layers

### 1. Application Layer

The entry point of the application is `main.ts`, which sets up the Express server, loads environment variables, and initializes the application.

### 2. Routing Layer

Routes are defined in the `routes` directory:
- `accountsRouter.ts` - Defines all endpoints related to account operations.

Routes are responsible for:
- Defining API endpoints
- Parameter validation
- Calling the appropriate controller methods
- Handling HTTP status codes and response formatting

### 3. Controller Layer

Controllers are located in the `controllers` directory:
- `accountsController.ts` - Contains business logic for account operations.

Controllers are responsible for:
- Implementing business logic
- Data validation
- Error handling
- Interacting with the data layer

### 4. Models Layer

Models are defined in the `models` directory:
- `account.model.ts` - Defines the interfaces for Account data structures
- `ApiError.ts` - Custom error class for consistent error handling

### 5. Data Access Layer

Data access is handled in the `services` directory:
- `accountsService.ts` - Provides methods to read and write account data

### 6. Middleware Layer

Middleware functions are defined in the `middlewares` directory:
- `errorHandler.ts` - Global error handling middleware

## Directory Structure

```
bank-api-node/
├── configs/
│   ├── database.ts
│   ├── logger.ts
│   └── userErrorMessages.ts
├── controllers/
│   └── accountsController.ts
├── data/
│   └── accounts.json
├── docs/
│   └── ...
├── middlewares/
│   └── errorHandler.ts
├── models/
│   ├── account.model.ts
│   └── ApiError.ts
├── routes/
│   └── accountsRouter.ts
├── services/
│   └── accountsService.ts
├── src/
│   └── ... (TypeScript source files)
├── swagger/
│   └── swagger.json
├── types/
│   └── account.ts
└── utils/
    └── ... (Utility functions)
```

## Data Flow

1. Client makes HTTP request to an endpoint
2. Request is processed by relevant Express middleware
3. Request is routed to the appropriate route handler
4. Route handler validates inputs and calls controller method
5. Controller executes business logic and interacts with services
6. Service layer handles data access and persistence
7. Response flows back through the controller and router
8. Express sends HTTP response to the client

## Key Architectural Decisions

1. **TypeScript** - Used throughout the application for type safety
2. **ESM Modules** - Modern JavaScript module system
3. **Express.js** - Lightweight web framework for routing and middleware
4. **Layered Architecture** - Clear separation of concerns
5. **File-Based Storage** - JSON files for data persistence
6. **Winston Logger** - Structured logging system
7. **Swagger/OpenAPI** - API documentation
8. **Environment Configuration** - Using dotenv for configuration

## Design Patterns

1. **Middleware Pattern** - For request processing and error handling
2. **Repository Pattern** - For data access abstraction
3. **Dependency Injection** - For loose coupling between components
4. **Error Handling Pattern** - Centralized error handling
