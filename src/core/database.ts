import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from './logger';

const initializeDatabase = async () => {
    if (config.MONGO_URI !== undefined) {
        try {
            const conn = await mongoose.connect(config.MONGO_URI);
            logger.info(`MongoDB connected successfully to: ${conn.connection.host}`);
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
};

export default initializeDatabase;
