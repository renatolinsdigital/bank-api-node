import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bank API',
      version: '1.0.0',
      description: 'A REST API for managing bank accounts with CRUD functionality',
      contact: {
        name: 'Renato Lins',
        email: 'renato@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: 'http://127.0.0.1:8080',
        description: 'Development server (IP)'
      }
    ],
    components: {
      schemas: {
        Account: {
          type: 'object',
          required: ['name', 'balance'],
          properties: {
            name: {
              type: 'string',
              description: 'Account holder name',
              example: 'Renato Lins'
            },
            balance: {
              type: 'number',
              description: 'Account balance',
              example: 10000.50
            }
          }
        },
        AccountWithId: {
          allOf: [
            {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                  description: 'Account ID',
                  example: 1
                }
              }
            },
            { $ref: '#/components/schemas/Account' }
          ]
        },
        AccountsData: {
          type: 'object',
          properties: {
            nextId: {
              type: 'integer',
              description: 'Next available ID',
              example: 11
            },
            accounts: {
              type: 'array',
              items: { $ref: '#/components/schemas/AccountWithId' }
            }
          }
        },
        TransferResult: {
          type: 'object',
          properties: {
            fromAccount: { $ref: '#/components/schemas/AccountWithId' },
            toAccount: { $ref: '#/components/schemas/AccountWithId' }
          }
        },
        AmountRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              description: 'Amount for the transaction',
              example: 500.50,
              minimum: 0.01
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Error message details'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotEnoughFunds: {
          description: 'Not enough funds for this operation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
    // Also include compiled JS files for production
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;