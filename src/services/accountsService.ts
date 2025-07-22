import { promises as fs } from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { AccountsData, AccountWithId } from '../models/account.model';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Use absolute path resolution for data location with modern ESM path handling
const dataLocation = process.env.DATA_LOCATION || 
  path.join(__dirname, '..', '..', 'data', 'accounts.json');

/**
 * Reads the full accounts data from the JSON file
 */
export const getAccountsFullJson = async (): Promise<AccountsData> => {
  try {
    const data = await fs.readFile(dataLocation, { encoding: 'utf-8' });
    return JSON.parse(data) as AccountsData;
  } catch (error) {
    throw new Error(`Failed to read accounts data: ${error}`);
  }
};

/**
 * Writes the accounts data to the JSON file
 */
export const writeAccountsData = async (data: AccountsData): Promise<void> => {
  try {
    await fs.writeFile(
      dataLocation, 
      JSON.stringify(data, null, 2),
      { encoding: 'utf8' }
    );
  } catch (error) {
    throw new Error(`Failed to write accounts data: ${error}`);
  }
};

/**
 * Checks if the provided account IDs exist in the data
 */
export const accountsDetails = async (...ids: number[]): Promise<{ 
  isEveryIdValid: boolean; 
  accountsFullJson: AccountsData;
  validAccounts?: AccountWithId[];
}> => {
  const accountsFullJson = await getAccountsFullJson();

  const validAccounts = accountsFullJson.accounts.filter(account => 
    ids.includes(account.id)
  );

  const isEveryIdValid = validAccounts.length === ids.length;

  return { isEveryIdValid, accountsFullJson, validAccounts };
};
