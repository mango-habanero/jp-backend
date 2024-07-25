import { logger } from './logger';

import { config } from '@/config';
import mongoose from 'mongoose';

const initializeDatabase = async () => {
    if (config.MONGO_URI !== undefined) {
        try {
            const conn = await mongoose.connect(config.MONGO_URI);
            logger.info(`MongoDB connected successfully to: ${conn.connection.host}`);
        } catch (error) {
            logger.error(`MongoDB connection error: ${error}.`);
            process.exit(1);
        }
    }
};

export default initializeDatabase;
