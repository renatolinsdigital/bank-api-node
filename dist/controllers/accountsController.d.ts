import { Account, AccountWithId, TransferResult } from '../types/account.js';
export declare const getAllAccounts: () => Promise<{
    nextId: number;
    accounts: AccountWithId[];
}>;
export declare const getAccountById: (id: string | number) => Promise<AccountWithId>;
export declare const createAccount: (account: Account) => Promise<AccountWithId>;
export declare const deleteAccountById: (id: string | number) => Promise<boolean>;
export declare const fullAccountUpdate: (account: AccountWithId) => Promise<AccountWithId>;
export declare const withDrawFromAccount: (id: string | number, amount: string | number) => Promise<AccountWithId>;
export declare const depositOnAccount: (id: string | number, amount: string | number) => Promise<AccountWithId>;
export declare const transferBetweenAccounts: (fromId: string | number, toId: string | number, amount: string | number) => Promise<TransferResult>;
