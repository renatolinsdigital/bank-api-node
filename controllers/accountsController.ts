import { promises as fs } from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiError from '../models/ApiError.js';

// Define account types
interface Account {
  name: string;
  balance: number;
}

interface AccountWithId extends Account {
  id: number;
}

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Destructure fs methods
const { readFile, writeFile } = fs;

dotenv.config();

// Use absolute path for data location
const dataLocation = process.env.DATA_LOCATION || 
  path.join(__dirname, '..', 'data', 'accounts.json');

/**
 * Retrieves all accounts from the data store
 */
const getAccountsFullJson = async (): Promise<{
  nextId: number;
  accounts: AccountWithId[];
}> => {
  const data = await readFile(dataLocation, { encoding: 'utf-8' });
  return JSON.parse(data);
};

/**
 * Validates if specified account IDs exist
 */
const accountsDetails = async (...ids: number[]): Promise<{
  isEveryIdValid: boolean;
  accountsFullJson: {
    nextId: number;
    accounts: AccountWithId[];
  };
}> => {
  const accountsFullJson = await getAccountsFullJson();

  const validIds = ids.filter(idFromParam => 
    accountsFullJson.accounts.some(account => account.id === idFromParam)
  );

  const isEveryIdValid = validIds.length === ids.length;

  return { isEveryIdValid, accountsFullJson };
};

/**
 * Retrieves all accounts from the data store
 */
export const getAllAccounts = async (): Promise<{
  nextId: number;
  accounts: AccountWithId[];
}> => {
  return await getAccountsFullJson();
};

/**
 * Retrieves a specific account by ID
 */
export const getAccountById = async (id: string | number): Promise<AccountWithId> => {
  const accountId = Number(id);

  if (isNaN(accountId)) throw ApiError.badRequest();

  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);

  if (!isEveryIdValid) throw ApiError.notFound();

  const queriedAccount = accountsFullJson.accounts
    .find(account => account.id === accountId);

  return queriedAccount as AccountWithId;
}

/**
 * Creates a new account
 */
export const createAccount = async (account: Account): Promise<AccountWithId> => {
  const { name, balance } = account;
  const accountBalance = Number(balance);

  if (!name || balance === undefined || isNaN(accountBalance)) {
    throw ApiError.badRequest();
  }

  const { accountsFullJson } = await accountsDetails();

  const newAccount: AccountWithId = {
    id: accountsFullJson.nextId++,
    name,
    balance: accountBalance
  };
  accountsFullJson.accounts.push(newAccount);

  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  return newAccount;
}

/**
 * Deletes an account by ID
 */
export const deleteAccountById = async (id: string | number): Promise<boolean> => {
  const accountId = Number(id);

  if (isNaN(accountId)) throw ApiError.badRequest();

  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);

  if (!isEveryIdValid) throw ApiError.notFound();

  const accountsUpdated = accountsFullJson.accounts
    .filter(account => account.id !== accountId);
  const accountsFullJsonUpdated = {
    nextId: accountsFullJson.nextId,
    accounts: accountsUpdated
  };
  
  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJsonUpdated, null, 2),
    { encoding: 'utf-8' }
  );
  
  return true;
}

/**
 * Updates an entire account
 */
export const fullAccountUpdate = async (account: AccountWithId): Promise<AccountWithId> => {
  const { id, name, balance } = account;
  const accountId = Number(id);
  const accountBalance = Number(balance);

  if (
    id === undefined ||
    isNaN(accountId) ||
    !name ||
    balance === undefined ||
    isNaN(accountBalance) ||
    accountBalance < 0
  ) {
    throw ApiError.badRequest();
  }

  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);

  if (!isEveryIdValid) throw ApiError.notFound();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  const updatedAccount: AccountWithId = {
    id: accountId,
    name,
    balance: accountBalance
  };
  accountsFullJson.accounts[index] = updatedAccount;

  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  return updatedAccount;
}

/**
 * Withdraws an amount from an account
 */
export const withDrawFromAccount = async (id: string | number, amount: number): Promise<AccountWithId> => {
  const accountId = Number(id);
  const operationAmount = Number(amount);

  if (
    id === undefined ||
    isNaN(accountId) ||
    amount === undefined ||
    isNaN(operationAmount) ||
    operationAmount < 1
  ) {
    throw ApiError.badRequest();
  }

  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);

  if (!isEveryIdValid) throw ApiError.notFound();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  if ((accountsFullJson.accounts[index].balance - operationAmount) < 0) {
    throw ApiError.notEnoughFunds();
  }

  accountsFullJson.accounts[index].balance -= operationAmount;

  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  const updatedAccount: AccountWithId = { ...accountsFullJson.accounts[index] };

  return updatedAccount;

}

/**
 * Deposits an amount to an account
 */
export const depositOnAccount = async (id: string | number, amount: number): Promise<AccountWithId> => {
  const accountId = Number(id);
  const operationAmount = Number(amount);

  if (
    id === undefined ||
    isNaN(accountId) ||
    amount === undefined ||
    isNaN(operationAmount) ||
    operationAmount < 1
  ) {
    throw ApiError.badRequest();
  }
  
  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);
  
  if (!isEveryIdValid) throw ApiError.notFound();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  accountsFullJson.accounts[index].balance += operationAmount;

  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  const updatedAccount: AccountWithId = { ...accountsFullJson.accounts[index] };

  return updatedAccount;

}

/**
 * Transfers an amount between two accounts
 */
export const transferBetweenAccounts = async (
  fromId: string | number, 
  toId: string | number, 
  amount: number
): Promise<{ fromAccount: AccountWithId; toAccount: AccountWithId }> => {
  const fromAccountWithId = Number(fromId);
  const toAccountWithId = Number(toId);
  const operationAmount = Number(amount);

  if (
    fromId === undefined ||
    isNaN(fromAccountWithId) ||
    toId === undefined ||
    isNaN(toAccountWithId) ||
    amount === undefined ||
    isNaN(operationAmount) ||
    operationAmount < 1
  ) {
    throw ApiError.badRequest();
  }
  
  const { isEveryIdValid, accountsFullJson } = 
    await accountsDetails(fromAccountWithId, toAccountWithId);
  
  if (!isEveryIdValid) throw ApiError.notFound();

  const fromIndex = accountsFullJson.accounts
    .findIndex(acc => acc.id === fromAccountWithId);

  if ((accountsFullJson.accounts[fromIndex].balance - operationAmount) < 0) {
    throw ApiError.notEnoughFunds();
  }

  accountsFullJson.accounts[fromIndex].balance -= operationAmount;

  const toIndex = accountsFullJson.accounts
    .findIndex(acc => acc.id === toAccountWithId);
  accountsFullJson.accounts[toIndex].balance += operationAmount;

  await writeFile(
    dataLocation, 
    JSON.stringify(accountsFullJson, null, 2),
    { encoding: 'utf-8' }
  );

  const fromAccount: AccountWithId = { ...accountsFullJson.accounts[fromIndex] };
  const toAccount: AccountWithId = { ...accountsFullJson.accounts[toIndex] };

  return { fromAccount, toAccount };
};







