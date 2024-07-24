import initializeDatabase from './database';

import { config } from '@/config';
import { pinoHttpConfig } from '@/core/logger';
import swaggerConfig from '@/docs/swagger.json';
import { routes } from '@/routes';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import pinoHttpLogger from 'pino-http';
import swaggerUi from 'swagger-ui-express';

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

app.use(pinoHttpLogger(pinoHttpConfig));

app.use('/', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

initializeDatabase();

export default app;
