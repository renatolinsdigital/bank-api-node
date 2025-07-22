import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Destructure winston objects
const { createLogger, transports } = winston;
const { combine, timestamp, printf, label } = winston.format;

// Format date for log filename
const today: string = new Date().toLocaleDateString().replaceAll('/', '-');

// Ensure logs directory exists
const logDir: string = path.join(__dirname, '..', '..', 'logs', today);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create custom log format
const myFormat = printf(({ level, message, label, timestamp }: winston.Logform.TransformableInfo): string => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create and configure logger
const logger: winston.Logger = createLogger({
  level: 'silly',
  format: combine(
    label({ label: 'Bank API' }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console({
      level: 'info'
    }),
    new transports.File({
      level: 'info',
      filename: path.join(logDir, `api-${today}.log`)
    }),
  ]
});

export default logger;

