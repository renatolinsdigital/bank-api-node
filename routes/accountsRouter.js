import express from 'express';
import logger from '../configs/logger.js';
import {
  getAccounts,
  getAccountById,
  createAccount,
  deleteAccountById,
  fullAccountUpdate,
  updateAccountBalance
} from '../controllers/accountsController.js';

const router = express.Router();

router.get('/', async (_, res, next) => {
  try {
    const accountsFullJson = await getAccounts();
    res.send(accountsFullJson.accounts);
    logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const accountId = Number(req.params?.id);
  try {
    const queriedAccount = await getAccountById(accountId);
    res.send(queriedAccount);
    logger.info(`GET /account/ - ${queriedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const account = req.body;
  try {
    const createdAccount = await createAccount(account);
    res.status(201).send(createdAccount);
    logger.info(`POST /account - ${createdAccount}`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const accountId = Number(req.params?.id);
  try {
    const deletedAccountId = await deleteAccountById(accountId);
    res.status(202).send(`Account ${deletedAccountId} has been deleted`);
    logger.info(`DELETE /account/${deletedAccountId}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  const account = req.body;
  try {
    const updatedAccount = await fullAccountUpdate(account);
    res.send(`Account ${account.id} has been fully updated`);
    logger.info(`PUT /account - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/balance/:id', async (req, res, next) => {
  const accountId = req.params?.id;
  const { newBalance } = req.body;
  try {
    const updatedAccount = await updateAccountBalance(accountId, newBalance);
    res.send(`Balance for account ${accountId} has been updated`);
    logger.info(`PATCH /balance/ - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

export default router;



