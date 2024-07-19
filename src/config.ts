import dotenv from 'dotenv';

interface ExpressConfig {
    CORS_ORIGINS: string[];
    ENVIRONMENT: string;
    HOST: string;
    LOG_LEVEL: string;
    PORT: number;
    SALT_ROUNDS: number;
    SERVICE_IDENTITY: string;
    TIMEZONE: string;
}

interface Config {
    EXPRESS: ExpressConfig;
    MONGO_URI: string;
}

function toList(value: string | undefined): string[] | undefined {
    if (value === undefined) {
        console.error('Error parsing string to list.');
    } else {
        return value.split(',');
    }
}

dotenv.config();

export const config: Config = {
    EXPRESS: {
        CORS_ORIGINS: toList(process.env.CORS_ORIGINS) ?? ['http://localhost:3000'],
        ENVIRONMENT: process.env.ENVIRONMENT ?? 'development',
        HOST: process.env.DOMAIN ?? 'localhost',
        LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
        PORT: parseInt(process.env.PORT ?? '3000'),
        SALT_ROUNDS: parseInt(process.env.SALTING_ROUNDS ?? '10'),
        SERVICE_IDENTITY: process.env.SERVICE_IDENTITY ?? 'service',
        TIMEZONE: process.env.TIMEZONE ?? 'Africa/Nairobi',
    },
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/jp_backend',
};
