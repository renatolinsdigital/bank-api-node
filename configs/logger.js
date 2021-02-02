import winston from 'winston';

const { createLogger, transports } = winston;
const { combine, timestamp, printf, label } = winston.format;
const today = new Date().toLocaleDateString().replaceAll('/', '-');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
});

const logger = createLogger({
  level: 'silly',
  format: combine(
    label({ label: 'Bank API' }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(
      {
        level: 'info'
      }
    ),
    new transports.File(
      {
        level: 'info',
        filename: `logs/${today}/api-${today}.log`
      }
    ),
  ]
});

export default logger;

