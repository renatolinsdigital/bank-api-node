export interface Account {
  name: string;
  balance: number;
}

export interface AccountWithId extends Account {
  id: number;
}

export interface AccountsData {
  nextId: number;
  accounts: AccountWithId[];
}

export interface TransferResult {
  fromAccount: AccountWithId;
  toAccount: AccountWithId;
}
