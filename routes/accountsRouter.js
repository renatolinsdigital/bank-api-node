import express from 'express';
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
    await deleteAccountById(id);
    res.status(202).send(`Account ${id} has been deleted`);
    logger.info(`DELETE /account/${id}`);
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
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const updatedAccount = await withDrawFromAccount(id, amount);
    const updatedBalance = JSON.parse(updatedAccount).balance;
    res.send(`Account ${id} new balance: ${updatedBalance}`);
    logger.info(`PATCH /withdraw/ - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/deposit/:id', async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const updatedAccount = await depositOnAccount(id, amount);
    const updatedBalance = JSON.parse(updatedAccount).balance;
    res.send(`Account ${id} new balance: ${updatedBalance}`);
    logger.info(`PATCH /deposit/ - ${updatedAccount}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/transfer', async (req, res, next) => {
  const { fromAccountWithId, toAccountWithId } = req.query;
  console.log('fromAccountWithId', fromAccountWithId);
  console.log('toAccountWithId', toAccountWithId);
  const { amount } = req.body;
  try {
    const { fromAccount, toAccount } =
      await transferBetweenAccounts(fromAccountWithId, toAccountWithId, amount);
    const transferResults =
      [
        `Account ${fromAccountWithId} balance: ${fromAccount.balance} / `,
        `Account ${toAccountWithId} balance: ${toAccount.balance}`
      ].join('');
    res.send(transferResults);
    logger.info(`PATCH /transfer - ${transferResults}`);
  } catch (err) {
    next(err);
  }
});

export default router;



