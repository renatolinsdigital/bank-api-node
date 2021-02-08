import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;
import dotenv from 'dotenv';
import ApiError from '../models/ApiError.js';

dotenv.config();

const dataLocation = String(process.env.DATA_LOCATION);

const getAccountsFullJson = async () => JSON.parse(await readFile(dataLocation, 'utf-8'));

const accountsDetails = async (...ids) => {
  const accountsFullJson = await getAccountsFullJson();

  const validIds = ids
    .filter(idFromParam => accountsFullJson.accounts
      .some(account => account.id === idFromParam)
    );

  const isEveryIdValid = validIds.length === ids.length;

  return { isEveryIdValid, accountsFullJson };
}

export const getAllAccounts = async () => await getAccountsFullJson();

export const getAccountById = async (id) => {
  const accountId = Number(id);

  if (isNaN(accountId)) throw ApiError.badRequest();
  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);
  if (!isEveryIdValid) throw ApiError.notFound();

  const queriedAccount = accountsFullJson.accounts
    .find(account => account.id === accountId);

  return JSON.stringify(queriedAccount);
}

export const createAccount = async (account) => {
  const { name, balance } = account;
  const accountBalance = Number(balance);

  if (!name
    || balance === undefined
    || isNaN(accountBalance)
  ) {
    throw ApiError.badRequest();
  }

  const { accountsFullJson } = await accountsDetails();
  const newAccount = {
    id: accountsFullJson.nextId++,
    name,
    balance: accountBalance
  };
  accountsFullJson.accounts.push(newAccount);

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  return JSON.stringify(newAccount);
}

export const deleteAccountById = async (id) => {
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
  await writeFile(dataLocation, JSON.stringify(accountsFullJsonUpdated, null, 2));
  return true;
}

export const fullAccountUpdate = async (account) => {
  const { id, name, balance } = account;
  const accountId = Number(id);
  const accountBalance = Number(balance);

  if (id === undefined
    || isNaN(accountId)
    || !name
    || balance === undefined
    || isNaN(accountBalance)
    || accountBalance < 0
  ) {
    throw ApiError.badRequest();
  }
  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);
  if (!isEveryIdValid) throw ApiError.notFound();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  const updatedAccount = {
    id: accountId,
    name,
    balance: accountBalance
  };
  accountsFullJson.accounts[index] = updatedAccount;

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  return JSON.stringify(updatedAccount);
}

export const withDrawFromAccount = async (id, amount) => {
  const accountId = Number(id);
  const operationAmount = Number(amount);

  if (id === undefined
    || isNaN(accountId)
    || amount === undefined
    || isNaN(operationAmount)
    || operationAmount < 1
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

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  const updatedAccount = { ...accountsFullJson.accounts[index] }

  return JSON.stringify(updatedAccount);

}

export const depositOnAccount = async (id, amount) => {
  const accountId = Number(id);
  const operationAmount = Number(amount);

  if (id === undefined
    || isNaN(accountId)
    || amount === undefined
    || isNaN(operationAmount)
    || operationAmount < 1
  ) {
    throw ApiError.badRequest();
  }
  const { isEveryIdValid, accountsFullJson } = await accountsDetails(accountId);
  if (!isEveryIdValid) throw ApiError.notFound();

  const index = accountsFullJson.accounts
    .findIndex(acc => acc.id === accountId);

  accountsFullJson.accounts[index].balance += operationAmount;

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  const updatedAccount = { ...accountsFullJson.accounts[index] }

  return JSON.stringify(updatedAccount);

}

export const transferBetweenAccounts = async (fromId, toId, amount) => {
  const fromAccountWithId = Number(fromId);
  const toAccountWithId = Number(toId);
  const operationAmount = Number(amount);

  if (fromId === undefined
    || isNaN(fromAccountWithId)
    || toId === undefined
    || isNaN(toAccountWithId)
    || amount === undefined
    || isNaN(operationAmount)
    || operationAmount < 1
  ) {
    throw ApiError.badRequest();
  }
  const { isEveryIdValid, accountsFullJson }
    = await accountsDetails(fromAccountWithId, toAccountWithId);
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

  await writeFile(dataLocation, JSON.stringify(accountsFullJson, null, 2));

  const fromAccount = { ...accountsFullJson.accounts[fromIndex] }
  const toAccount = { ...accountsFullJson.accounts[toIndex] }

  return { fromAccount, toAccount };

}







