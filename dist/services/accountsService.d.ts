import { AccountsData, AccountWithId } from '../types/account.js';
export declare const getAccountsFullJson: () => Promise<AccountsData>;
export declare const writeAccountsData: (data: AccountsData) => Promise<void>;
export declare const accountsDetails: (...ids: number[]) => Promise<{
    isEveryIdValid: boolean;
    accountsFullJson: AccountsData;
    validAccounts?: AccountWithId[];
}>;
