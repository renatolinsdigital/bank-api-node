import { promises as fs } from 'fs';
import '../configs/global-consts.js';
const { readFile, writeFile } = fs;

export const getAccounts = async () => {
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  return accountsFullJson;
}

export const getAccountById = async (accountId) => {
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  const queriedAccount = accountsFullJson.accounts
    .find(account => account.id === accountId);
  return queriedAccount;
}

export const createAccount = async (name, balance) => {
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  const newAccount = {
    id: accountsFullJson.nextId++,
    name,
    balance
  };
  accountsFullJson.accounts.push(newAccount);
  await writeFile(DATA_LOCATION, JSON.stringify(accountsFullJson, null, 2));
  return newAccount;
}

export const deleteAccountById = async (accountId) => {
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  const isAccountIdValid = accountsFullJson.accounts.some(account => account.id === accountId);
  if (!isAccountIdValid) return ERROR_NOT_FOUND;
  const accountsUpdated = accountsFullJson.accounts
    .filter(account => account.id !== accountId);
  const accountsFullJsonUpdated = {
    nextId: accountsFullJson.nextId,
    accounts: accountsUpdated
  };
  await writeFile(DATA_LOCATION, JSON.stringify(accountsFullJsonUpdated, null, 2));
}

export const fullUpdate = async (account) => {
  const { id, name, balance } = account;
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === account.id);
  if (index === -1) return ERROR_NOT_FOUND;
  const updatedAccount = {
    id,
    name,
    balance
  };
  accountsFullJson.accounts[index] = updatedAccount;
  await writeFile(DATA_LOCATION, JSON.stringify(accountsFullJson, null, 2));
}

export const balanceUpdate = async (accountId, newBalance) => {
  const accountsFullJson = JSON.parse(await readFile(DATA_LOCATION, 'utf-8'));
  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);
  if (index === -1) return ERROR_NOT_FOUND;
  accountsFullJson.accounts[index].balance = newBalance;
  await writeFile(DATA_LOCATION, JSON.stringify(accountsFullJson, null, 2));

}

