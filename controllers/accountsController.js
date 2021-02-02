import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;
import dotenv from 'dotenv';
import ApiError from '../models/ApiError.js';

dotenv.config();

const dataLocation = String(process.env.DATA_LOCATION);

const getAccountsFullJson = async () => JSON.parse(await readFile(dataLocation, 'utf-8'));

const isAccountIdValid = async (accountId) => {
  const accountsFullJson = await getAccountsFullJson();
  const isIdValid = accountsFullJson.accounts.some(account => account.id === accountId);
  return isIdValid;
}

export const getAccounts = async () => await getAccountsFullJson();

export const getAccountById = async (accountId) => {
  if (isNaN(accountId)) throw ApiError.badRequest();
  const isAccountValid = await isAccountIdValid(accountId);
  if (!isAccountValid) throw ApiError.notFound();

  const accountsFullJson = await getAccountsFullJson();
  const queriedAccount = accountsFullJson.accounts
    .find(account => account.id === accountId);

  return JSON.stringify(queriedAccount);
}

export const createAccount = async (account) => {
  const { name, balance } = account;

  if (!name || balance === undefined) throw ApiError.badRequest();
  const accountsFullJson = await getAccountsFullJson();
  const newAccount = {
    id: accountsFullJson.nextId++,
    name,
    balance
  };
  accountsFullJson.accounts.push(newAccount);

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  return JSON.stringify(newAccount);
}

export const deleteAccountById = async (accountId) => {
  if (isNaN(accountId)) throw ApiError.badRequest();
  const isAccountValid = await isAccountIdValid(accountId);
  if (!isAccountValid) throw ApiError.notFound();

  const accountsFullJson = await getAccountsFullJson();

  const accountsUpdated = accountsFullJson.accounts
    .filter(account => account.id !== accountId);
  const accountsFullJsonUpdated = {
    nextId: accountsFullJson.nextId,
    accounts: accountsUpdated
  };
  await writeFile(dataLocation, JSON.stringify(accountsFullJsonUpdated, null, 2));
  return accountId;
}

export const fullAccountUpdate = async (account) => {
  const { id, name, balance } = account;
  const accountId = Number(id);
  const accountBalance = Number(balance);

  if (id === undefined
    || isNaN(accountId)
    || !name
    || balance === undefined
    || isNaN(accountBalance)) {
    throw ApiError.badRequest();
  }
  const isAccountValid = await isAccountIdValid(accountId);
  if (!isAccountValid) throw ApiError.notFound();

  const accountsFullJson = await getAccountsFullJson();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === account.id);

  const updatedAccount = {
    id,
    name,
    balance
  };
  accountsFullJson.accounts[index] = updatedAccount;
  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  return JSON.stringify(updatedAccount);
}

export const updateAccountBalance = async (id, balance) => {
  const accountId = Number(id);
  const newBalance = Number(balance);

  if (id === undefined
    || isNaN(accountId)
    || balance === undefined
    || isNaN(newBalance)) {
    throw ApiError.badRequest();
  }
  const isAccountValid = await isAccountIdValid(accountId);
  if (!isAccountValid) throw ApiError.notFound();

  const accountsFullJson = await getAccountsFullJson();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  accountsFullJson.accounts[index].balance = newBalance;

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  const updatedAccount = { ...accountsFullJson.accounts[index] }
  
  return JSON.stringify(updatedAccount);

}

