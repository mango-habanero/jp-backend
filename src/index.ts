import app from './app';
import { config } from './config';
import { logger } from "./logger";

app.listen(config.EXPRESS.PORT, config.EXPRESS.HOST, () => {
  logger.info(`Server running on http://${config.EXPRESS.HOST}:${config.EXPRESS.PORT}`)
});