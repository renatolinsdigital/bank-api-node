import express from 'express';
import logger from '../configs/logger.js';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  deleteAccountById,
  fullAccountUpdate,
  withDrawFromAccount,
  depositOnAccount
} from '../controllers/accountsController.js';

const router = express.Router();

router.get('/', async (_, res, next) => {
  try {
    const accountsFullJson = await getAllAccounts();
    res.send(accountsFullJson.accounts);
    logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const queriedAccount = await getAccountById(id);
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
  const { id } = req.params;
  try {
    const deletedAccountId = await deleteAccountById(id);
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
    console.log(updatedAccount);
    res.send(`Account ${account.id} has been fully updated`);
    logger.info(`PUT /account - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/withdraw/:id', async (req, res, next) => {
  const accountId = req.params?.id;
  const { amount } = req.body;
  try {
    const updatedAccount = await withDrawFromAccount(accountId, amount);
    const updatedBalance = JSON.parse(updatedAccount).balance;
    res.send(`Account ${accountId} new balance: ${updatedBalance}`);
    logger.info(`PATCH /withdraw/ - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/deposit/:id', async (req, res, next) => {
  const accountId = req.params?.id;
  const { amount } = req.body;
  try {
    const updatedAccount = await depositOnAccount(accountId, amount);
    const updatedBalance = JSON.parse(updatedAccount).balance;
    res.send(`Account ${accountId} new balance: ${updatedBalance}`);
    logger.info(`PATCH /deposit/ - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

export default router;



