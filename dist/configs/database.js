import { promises as fs } from 'fs';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = process.env.DATA_PATH || path.join(__dirname, '..', '..', 'data');
const dataLocation = process.env.DATA_LOCATION || path.join(dataPath, 'accounts.json');
async function fileExists(pathToCheck) {
    try {
        await fs.access(pathToCheck, fs.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
export const setInitialData = async () => {
    try {
        const pathExists = await fileExists(dataPath);
        if (!pathExists) {
            await fs.mkdir(dataPath, { recursive: true });
            logger.info(`Created data directory: ${dataPath}`);
        }
        const fileExistsCheck = await fileExists(dataLocation);
        if (!fileExistsCheck) {
            const initialData = { nextId: 1, accounts: [] };
            await fs.writeFile(dataLocation, JSON.stringify(initialData, null, 2), { encoding: 'utf8' });
            logger.info('Initial data created!');
        }
    }
    catch (err) {
        logger.error(`Error setting up initial data: ${err}`);
        throw err;
    }
};
//# sourceMappingURL=database.js.map