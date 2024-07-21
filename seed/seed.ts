import mongoose, { Document, Model } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { config } from '../src/config';
import dotenv from 'dotenv';
import { logger } from '../src/core/logger';
import { User } from '../src/schemas/user';

dotenv.config();

interface SeedConfig {
    deduplicate: boolean;
    uniqueField: string;
}

async function seedDatabase<T extends Document>(
    model: Model<T>,
    dataFile: string,
    conf: Partial<SeedConfig> = { deduplicate: false },
): Promise<void> {
    try {
        if (config.EXPRESS.ENVIRONMENT === 'production') {
            throw new Error('Cannot seed in production.');
        }
        let data: T[];
        logger.debug(`loading data from: ${model.modelName}`);
        const filePath = path.resolve(__dirname, `data/${dataFile}`);
        const rawData: T[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        logger.debug('connecting to the database...');
        await mongoose.connect(config.MONGO_URI);

        logger.debug(`clearing existing data for model: ${model.modelName}`);
        await model.deleteMany({});

        if (conf.deduplicate && conf.uniqueField) {
            logger.debug('deduplicating data ...');
            const seen = new Set();
            const duplicates: T[] = [];

            data = rawData.reduce<T[]>((acc, curr) => {
                const uniqueValue = curr[conf.uniqueField as keyof T];
                if (seen.has(uniqueValue)) {
                    duplicates.push(curr);
                } else {
                    seen.add(uniqueValue);
                    acc.push(curr);
                }
                return acc;
            }, []);

            if (duplicates.length > 0) {
                logger.warn(
                    `Found ${duplicates.length} duplicate(s) for field ${conf.uniqueField}:`,
                );
                duplicates.forEach((duplicate) =>
                    logger.warn(duplicate[conf.uniqueField as keyof T]),
                );
            }
        } else {
            data = rawData;
        }

        logger.debug(`inserting data for model: ${model.modelName}`);
        await model.init();
        await model.create(data);

        logger.info('seeding completed.');
        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding data: ${error}`);
        process.exit(1);
    }
}

async function seedUsers() {
    logger.info('seeding users...');
    await seedDatabase(User, 'users.json', { deduplicate: true, uniqueField: 'email' });
}

seedUsers();
