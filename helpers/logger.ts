import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';
const logDir = isProduction ? '/var/log/vy_accruals' : path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestampFormat = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

const DailyRotateFile = require('winston-daily-rotate-file');

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    timestampFormat,
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d'
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ]
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    timestampFormat,
    logFormat
  )
}));
