# Data Storage

This document describes the data storage approach in the Bank API application.

## Overview

The Bank API uses a file-based data storage approach, persisting data in JSON files. This approach was chosen for simplicity and ease of demonstration, though in a production environment, a database would typically be used.

## Data Structure

### Account Data Model

The core data structure is the Account model:

```typescript
// From models/account.model.ts
export interface Account {
  name: string;
  balance: number;
}

export interface AccountWithId extends Account {
  id: number;
}

export interface AccountsData {
  nextId: number;
  accounts: AccountWithId[];
}
```

### Data File Format

The accounts data is stored in a JSON file with the following structure:

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

## Data Access Layer

The data access functionality is implemented in the `services/accountsService.ts` file:

```typescript
import { promises as fs } from 'fs';
import { AccountsData, AccountWithId } from '../models/account.model';

// Data file location
const dataLocation = process.env.DATA_LOCATION || 
  path.join(__dirname, '..', '..', 'data', 'accounts.json');

/**
 * Reads the full accounts data from the JSON file
 */
export const getAccountsFullJson = async (): Promise<AccountsData> => {
  try {
    const data = await fs.readFile(dataLocation, { encoding: 'utf-8' });
    return JSON.parse(data) as AccountsData;
  } catch (error) {
    throw new Error(`Failed to read accounts data: ${error}`);
  }
};

/**
 * Writes the accounts data to the JSON file
 */
export const writeAccountsData = async (accountsData: AccountsData): Promise<void> => {
  try {
    await fs.writeFile(
      dataLocation,
      JSON.stringify(accountsData, null, 2),
      { encoding: 'utf-8' }
    );
  } catch (error) {
    throw new Error(`Failed to write accounts data: ${error}`);
  }
};
```

## Fallback Data

The application includes a mechanism to handle missing or corrupted data files by using a mock data file as a fallback:

```typescript
// From configs/database.ts
import { promises as fs } from 'fs';
import { AccountsData } from '../models/account.model';
import path from 'path';

// Define path constants
const dataPath = process.env.DATA_PATH || path.join(__dirname, '..', '..', 'data');
const dataLocation = process.env.DATA_LOCATION || path.join(dataPath, 'accounts.json');
const mockDataLocation = path.join(__dirname, '..', '..', 'mock-data', 'accounts.json');

/**
 * Ensures the data directory and initial data file exist
 */
export const setInitialData = async (): Promise<void> => {
  try {
    // Check if data directory exists, create if not
    if (!(await fileExists(dataPath))) {
      await fs.mkdir(dataPath, { recursive: true });
    }
    
    // Check if data file exists, create if not
    if (!(await fileExists(dataLocation))) {
      // Try to use mock data if available
      if (await fileExists(mockDataLocation)) {
        const mockData = await fs.readFile(mockDataLocation, { encoding: 'utf-8' });
        await fs.writeFile(dataLocation, mockData, { encoding: 'utf-8' });
      } else {
        // Create empty data structure
        const initialData: AccountsData = {
          nextId: 1,
          accounts: []
        };
        await fs.writeFile(
          dataLocation,
          JSON.stringify(initialData, null, 2),
          { encoding: 'utf-8' }
        );
      }
    }
  } catch (error) {
    throw new Error(`Failed to set up initial data: ${error}`);
  }
};
```

## Data Operations

The data access operations include:

1. **Read All** - Getting all accounts
2. **Read One** - Getting a specific account by ID
3. **Create** - Adding a new account
4. **Update** - Modifying an existing account
5. **Delete** - Removing an account
6. **Transaction Operations** - Deposit, withdraw, transfer

Example of a transaction operation:

```typescript
// From accountsController.ts
export const transferBetweenAccounts = async (
  fromId: string | number, 
  toId: string | number, 
  amount: number
): Promise<{ fromAccount: AccountWithId; toAccount: AccountWithId }> => {
  // Validation...
  
  const { isEveryIdValid, accountsFullJson } = 
    await accountsDetails(fromAccountWithId, toAccountWithId);
  
  if (!isEveryIdValid) throw ApiError.notFound();

  // Update balances
  const fromIndex = accountsFullJson.accounts
    .findIndex(acc => acc.id === fromAccountWithId);
  accountsFullJson.accounts[fromIndex].balance -= operationAmount;

  const toIndex = accountsFullJson.accounts
    .findIndex(acc => acc.id === toAccountWithId);
  accountsFullJson.accounts[toIndex].balance += operationAmount;

  // Persist changes
  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  // Return updated accounts
  const fromAccount: AccountWithId = { ...accountsFullJson.accounts[fromIndex] };
  const toAccount: AccountWithId = { ...accountsFullJson.accounts[toIndex] };

  return { fromAccount, toAccount };
};
```

## Concurrency Considerations

The current implementation does not include explicit concurrency control. In a production environment with multiple instances or users, this could lead to race conditions. A database with transaction support would be more appropriate for production use.

## Production Considerations

For a production environment, consider:

1. **Database Migration** - Replace file-based storage with a proper database (PostgreSQL, MongoDB, etc.)
2. **Data Access Layer** - Implement a repository pattern to abstract database operations
3. **Connection Pooling** - Optimize database connections
4. **Transaction Support** - Ensure data consistency with transactions
5. **Caching** - Implement caching for frequently accessed data
6. **Backup Strategy** - Regular backups and recovery procedures
