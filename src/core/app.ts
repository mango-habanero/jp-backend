import compression from 'compression';
import { config } from '../config';
import cors from 'cors';
import express, { Express } from 'express';

import healthCheckRouter from '../routes/health';
import initializeDatabase from './database';

const app: Express = express();
app.use(
    cors({
        origin: (origin, callback) => {
            if (config.EXPRESS.CORS_ORIGINS.indexOf(origin as string) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    }),
);
app.use(compression());
app.use(express.json());

// initialize database connection.
initializeDatabase();

// load routes
app.use('/health-check', healthCheckRouter);

export default app;