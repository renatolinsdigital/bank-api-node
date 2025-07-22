# Automatic Swagger Documentation

This project now uses **automatic Swagger documentation generation** instead of manually maintaining a large swagger.json file.

## How it works

1. **JSDoc Comments**: API endpoints are documented using JSDoc comments with Swagger annotations directly in the route files
2. **swagger-jsdoc**: Automatically reads the JSDoc comments and generates OpenAPI specification
3. **Dynamic Generation**: Swagger documentation is generated at runtime, always staying in sync with the code

## Benefits

- ✅ No manual swagger.json maintenance
- ✅ Documentation stays in sync with code
- ✅ Cleaner, more maintainable codebase
- ✅ Automatic schema validation
- ✅ Better developer experience

## Usage

### Development (Automatic)
When you run the development server, Swagger documentation is automatically generated:

```bash
npm run dev
```

The Swagger UI will be available at: http://localhost:8080/swagger

### Generate Static File (Optional)
If you need a static swagger.json file for external tools:

```bash
npm run generate-swagger
```

This creates a `swagger/swagger.json` file that can be used with other tools.

## Adding Documentation

To document a new API endpoint, add JSDoc comments above the route definition:

```typescript
/**
 * @swagger
 * /account/{id}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get account by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountWithId'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', async (req, res, next) => {
  // Route implementation
});
```

## Configuration

Swagger configuration is located in `src/configs/swagger.ts`:

- **API Information**: Title, version, description, contact info
- **Servers**: Development and production URLs
- **Schemas**: Data models and error responses
- **File Paths**: Which files to scan for documentation

## Schema Definitions

Common schemas are defined in the Swagger configuration file:

- `Account`: Basic account data (name, balance)
- `AccountWithId`: Account with ID field
- `AccountsData`: Full accounts data structure
- `Error`: Standard error response format

These can be referenced in route documentation using `$ref: '#/components/schemas/SchemaName'`.
