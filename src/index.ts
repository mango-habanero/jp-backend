import app from './core/app';
import { config } from './config';
import { logger } from './core/logger';

app.listen(config.EXPRESS.PORT, config.EXPRESS.HOST, () => {
    logger.info(`Server running on http://${config.EXPRESS.HOST}:${config.EXPRESS.PORT}`);
});
