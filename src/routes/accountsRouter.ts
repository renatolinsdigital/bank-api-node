import express, { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  deleteAccountById,
  fullAccountUpdate,
  withDrawFromAccount,
  depositOnAccount,
  transferBetweenAccounts
} from '../controllers/accountsController';
import { Account, AccountWithId } from '../models/account.model';

const router = express.Router();

/**
 * @swagger
 * /account:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get all accounts
 *     description: Retrieves a list of all bank accounts
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccountWithId'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const accountsFullJson = await getAllAccounts();
    res.send(accountsFullJson.accounts);
    logger.info('GET /account');
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /account/{id}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get account by ID
 *     description: Retrieves a specific account by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountWithId'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Create a new account
 *     description: Creates a new bank account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountWithId'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account/{id}:
 *   delete:
 *     tags:
 *       - Accounts
 *     summary: Delete an account
 *     description: Deletes a bank account by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID to delete
 *     responses:
 *       202:
 *         description: Account deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Account 1 has been deleted"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account:
 *   put:
 *     tags:
 *       - Accounts
 *     summary: Update an account completely
 *     description: Performs a full update of an existing account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountWithId'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Account 1 has been fully updated"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account/withdraw/{id}:
 *   patch:
 *     tags:
 *       - Accounts
 *     summary: Withdraw from account
 *     description: Withdraws a specified amount from an account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID to withdraw from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmountRequest'
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Account 1 new balance: 9500.00"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/NotEnoughFunds'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account/deposit/{id}:
 *   patch:
 *     tags:
 *       - Accounts
 *     summary: Deposit to account
 *     description: Deposits a specified amount to an account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID to deposit to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmountRequest'
 *     responses:
 *       200:
 *         description: Deposit successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Account 1 new balance: 11000.25"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /account/transfer:
 *   patch:
 *     tags:
 *       - Accounts
 *     summary: Transfer between accounts
 *     description: Transfers a specified amount from one account to another
 *     parameters:
 *       - in: query
 *         name: fromAccountWithId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the account to transfer from
 *         example: 1
 *       - in: query
 *         name: toAccountWithId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the account to transfer to
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmountRequest'
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Account 1 balance: 9749.25 / Account 2 balance: 5531.50"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/NotEnoughFunds'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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
