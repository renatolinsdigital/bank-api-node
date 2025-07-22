import express, { Request, Response, NextFunction } from 'express';
import logger from '../configs/logger.js';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  deleteAccountById,
  fullAccountUpdate,
  withDrawFromAccount,
  depositOnAccount,
  transferBetweenAccounts
} from '../controllers/accountsController.js';
import { Account, AccountWithId } from '../types/account.js';

const router = express.Router();

router.get('/', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const accountsFullJson = await getAllAccounts();
    res.send(accountsFullJson.accounts);
    logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const queriedAccount = await getAccountById(id);
    res.send(queriedAccount);
    logger.info(`GET /account/${id} - ${JSON.stringify(queriedAccount)}`);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const account = req.body as Account;
  try {
    const createdAccount = await createAccount(account);
    res.status(201).send(createdAccount);
    logger.info(`POST /account - ${JSON.stringify(createdAccount)}`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await deleteAccountById(id);
    res.status(202).send(`Account ${id} has been deleted`);
    logger.info(`DELETE /account/${id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  const account = req.body as AccountWithId;
  try {
    const updatedAccount = await fullAccountUpdate(account);
    res.send(`Account ${account.id} has been fully updated`);
    logger.info(`PUT /account - ${JSON.stringify(updatedAccount)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/withdraw/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const updatedAccount = await withDrawFromAccount(id, amount);
    res.send(`Account ${id} new balance: ${updatedAccount.balance}`);
    logger.info(`PATCH /withdraw/${id} - ${JSON.stringify(updatedAccount)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/deposit/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const updatedAccount = await depositOnAccount(id, amount);
    res.send(`Account ${id} new balance: ${updatedAccount.balance}`);
    logger.info(`PATCH /deposit/${id} - ${JSON.stringify(updatedAccount)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/transfer', async (req: Request, res: Response, next: NextFunction) => {
  const { fromAccountWithId, toAccountWithId } = req.query;
  const { amount } = req.body;
  try {
    const { fromAccount, toAccount } = await transferBetweenAccounts(
      fromAccountWithId as string, 
      toAccountWithId as string, 
      amount
    );
    
    const transferResults = `Account ${fromAccountWithId} balance: ${fromAccount.balance} / Account ${toAccountWithId} balance: ${toAccount.balance}`;
    res.send(transferResults);
    logger.info(`PATCH /transfer - ${transferResults}`);
  } catch (err) {
    next(err);
  }
});

export default router;
