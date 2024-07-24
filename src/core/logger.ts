import { config } from '@/config';
import { Request, Response } from 'express';
import moment from 'moment-timezone';
import pino, { Logger, LoggerOptions } from 'pino';
import PinoPretty from 'pino-pretty';

const createLogger = (): Logger => {
    const logOptions: LoggerOptions = {
        formatters: {
            level: (label: string) => ({ level: label.toUpperCase() }),
        },
        level: config.EXPRESS.LOG_LEVEL,
        name: config.EXPRESS.SERVICE_IDENTITY,
        timestamp: () =>
            `,"time":"${moment(new Date(Date.now())).tz(config.EXPRESS.TIMEZONE).format('DD-MM-YYYY HH:mm A')}"`,
    };

    if (process.env.NODE_ENV !== 'production') {
        const stream = PinoPretty({
            colorize: true,
        });
        return pino(logOptions, stream);
    } else {
        return pino(logOptions);
    }
};

const logger = createLogger();

const pinoHttpConfig = {
    logger,
    genReqId: (req: Request) => `${req.ip}-${Date.now()}`,
    customSuccessMessage: (req: Request, res: Response) => {
        const { method, url, httpVersion } = req;
        const { statusCode } = res;
        return `${req.socket.remoteAddress}:${req.socket.remotePort} - '${method} ${url} HTTP/${httpVersion}' ${statusCode}`;
    },
    customErrorMessage: (req: Request, res: Response, error: Error) => {
        const { method, url, httpVersion } = req;
        const { statusCode } = res;
        return `${req.socket.remoteAddress}:${req.socket.remotePort} - '${method} ${url} HTTP/${httpVersion}' ${statusCode} - ${error.message}`;
    },
    customAttributeKeys: {
        req: 'http',
        res: 'http',
        err: 'error',
        responseTime: 'duration',
        reqId: 'request_id',
    },
    customProps: (req: Request, res: Response) => ({
        http: {
            url: req.url,
            status_code: res.statusCode,
            method: req.method,
            version: req.httpVersion,
        },
        network: {
            client: {
                ip: req.socket.remoteAddress,
                port: req.socket.remotePort,
            },
        },
    }),
    quietReqLogger: true,
};

export { logger, pinoHttpConfig };
