import { promises as fs } from 'fs';
import { AccountsData } from '../models/account.model';
import logger from './logger';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define path constants - use absolute paths for reliability
const dataPath = process.env.DATA_PATH || path.join(__dirname, '..', '..', 'data');
const dataLocation = process.env.DATA_LOCATION || path.join(dataPath, 'accounts.json');

/**
 * Checks if a file or directory exists using async fs.access
 * Modern approach that avoids fs.Stats constructor deprecation warning
 */
async function fileExists(pathToCheck: string): Promise<boolean> {
  try {
    await fs.access(pathToCheck, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures the data directory and initial data file exist
 */
export const setInitialData = async (): Promise<void> => {
  try {
    // Ensure data directory exists
    const pathExists = await fileExists(dataPath);
    
    if (!pathExists) {
      // Use recursive option to create all directories in the path
      await fs.mkdir(dataPath, { recursive: true });
      logger.info(`Created data directory: ${dataPath}`);
    }

    // Ensure data file exists
    const fileExistsCheck = await fileExists(dataLocation);
    
    if (!fileExistsCheck) {
      const initialData: AccountsData = { nextId: 1, accounts: [] };
      // Write with proper encoding specified
      await fs.writeFile(
        dataLocation, 
        JSON.stringify(initialData, null, 2), 
        { encoding: 'utf8' }
      );
      logger.info('Initial data created!');
    }
  } catch (err) {
    logger.error(`Error setting up initial data: ${err}`);
    throw err;
  }
};
