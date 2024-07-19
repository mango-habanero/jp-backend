import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { logger } from '../core/logger';

let mongod: MongoMemoryServer;

export async function setupDB() {
    logger.info('Setting up the in-memory database...');
    mongod = await MongoMemoryServer.create();
}

export async function teardownDB() {
    if (mongod) {
        logger.info('Tearing down the in-memory database...');
        await mongod.ensureInstance();
        const { collections } = mongoose.connection;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        await mongoose.disconnect();
        await mongod.stop({ doCleanup: true, force: true });
    }
}
