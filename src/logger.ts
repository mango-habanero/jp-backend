import pino from 'pino';
import { config } from './config';
import moment from 'moment-timezone';

export const logger = pino({
    name: config.EXPRESS.SERVICE_IDENTITY,
    level: config.EXPRESS.LOG_LEVEL,
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: () =>
        `,"time":"${moment(new Date(Date.now())).tz(config.EXPRESS.TIMEZONE).format('DD-MM-YYYY HH:mm A')}"`,
});
