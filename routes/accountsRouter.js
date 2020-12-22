import express from 'express';
import '../configs/global-consts.js';
import '../configs/logger.js';
import {
  getAccounts,
  getAccountById,
  createAccount,
  deleteAccountById,
  fullUpdate,
  balanceUpdate
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
  if (isNaN(accountId)) {
    next(ERROR_MALFORMED_REQUEST);
    return;
  }
  try {
    const queriedAccount = await getAccountById(accountId);
    if (!queriedAccount) {
      next(ERROR_NOT_FOUND);
      return;
    }
    res.send(queriedAccount);
    logger.info(`GET /account/${accountId}`);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const account = req.body;
  const { name, balance } = account;
  if (!account || !name || balance === undefined) {
    next(ERROR_MALFORMED_REQUEST);
    return;
  }
  try {
    const newAccountAdded = await createAccount(name, balance);
    res.send(newAccountAdded);
    logger.info(`POST /account - ${JSON.stringify(newAccountAdded)}`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const accountId = Number(req.params?.id);
  if (isNaN(accountId)) {
    next(ERROR_MALFORMED_REQUEST);
    return;
  }
  try {
    const deletionError = await deleteAccountById(accountId);
    if (deletionError) {
      next(deletionError);
      return;
    }
    res.status(202).send(`Account ${accountId} has been deleted`);
    logger.info(`DELETE /account/${accountId}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  const account = req.body;
  const { id, name, balance } = account;
  if (!account || id === undefined || !name || balance === undefined) {
    next(ERROR_MALFORMED_REQUEST);
    return;
  }
  try {
    const fullUpdateError = await fullUpdate(account);
    if (fullUpdateError) {
      next(fullUpdateError);
      return;
    }
    res.send(`Account ${account.id} has been fully updated`);
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/balance/:id', async (req, res, next) => {
  const accountId = Number(req.params?.id);
  const { newBalance } = req.body;
  if (isNaN(accountId) || newBalance === undefined) {
    next(ERROR_MALFORMED_REQUEST);
    return;
  }
  try {
    const balanceUpdateError = await balanceUpdate(accountId, newBalance);
    if (balanceUpdateError) {
      next(balanceUpdateError);
      return;
    }
    res.send(`Account ${accountId} balance has been updated`);
    logger.info(`PATCH /balance/${accountId} - balance: ${newBalance}`);
  } catch (err) {
    next(err);
  }
});

// Error handling

router.use((err, _, res, next) => {
  logger.error(err.message);
  res.status(err.status || 400).send({ error: err.message });
});

export default router;



