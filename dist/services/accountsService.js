import { promises as fs } from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const dataLocation = process.env.DATA_LOCATION ||
    path.join(__dirname, '..', '..', 'data', 'accounts.json');
export const getAccountsFullJson = async () => {
    try {
        const data = await fs.readFile(dataLocation, { encoding: 'utf-8' });
        return JSON.parse(data);
    }
    catch (error) {
        throw new Error(`Failed to read accounts data: ${error}`);
    }
};
export const writeAccountsData = async (data) => {
    try {
        await fs.writeFile(dataLocation, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    }
    catch (error) {
        throw new Error(`Failed to write accounts data: ${error}`);
    }
};
export const accountsDetails = async (...ids) => {
    const accountsFullJson = await getAccountsFullJson();
    const validAccounts = accountsFullJson.accounts.filter(account => ids.includes(account.id));
    const isEveryIdValid = validAccounts.length === ids.length;
    return { isEveryIdValid, accountsFullJson, validAccounts };
};
//# sourceMappingURL=accountsService.js.map