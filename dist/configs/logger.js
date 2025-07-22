import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { createLogger, transports } = winston;
const { combine, timestamp, printf, label } = winston.format;
const today = new Date().toLocaleDateString().replaceAll('/', '-');
const logDir = path.join(__dirname, '..', '..', 'logs', today);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(label({ label: 'Bank API' }), timestamp(), myFormat),
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
//# sourceMappingURL=logger.js.map