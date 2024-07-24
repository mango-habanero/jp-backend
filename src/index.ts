import { config } from '@/config';
import app from '@/core/app';
import { logger } from '@/core/logger';

app.listen(config.EXPRESS.PORT, config.EXPRESS.HOST, () => {
    logger.info(`Server running on http://${config.EXPRESS.HOST}:${config.EXPRESS.PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
        logger.info('Gracefully shutting down.');
        return process.exit(0);
    });
}
