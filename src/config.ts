import dotenv from 'dotenv';

dotenv.config();

interface EmailEngineConfig {
    API_URL: string;
    API_KEY: string;
    SENDER: string;
}

interface ExpressConfig {
    CORS_ORIGINS: string[];
    CLIENT_DOMAIN: string;
    ENVIRONMENT: string;
    HOST: string;
    JWT_SECRET: Uint8Array;
    LOG_LEVEL: string;
    PORT: number;
    SALT_ROUNDS: number;
    SERVICE_IDENTITY: string;
    TIMEZONE: string;
}

interface Config {
    EMAIL_ENGINE: EmailEngineConfig;
    EXPRESS: ExpressConfig;
    MONGO_URI: string;
}

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

export const config: Config = {
    EMAIL_ENGINE: {
        API_URL: process.env.EMAIL_ENGINE_API_URL ?? 'http://127.0.0.1:3000',
        API_KEY: process.env.EMAIL_ENGINE_API_KEY ?? '',
        SENDER: process.env.EMAIL_ENGINE_SENDER ?? 'mailer@test.com',
    },
    EXPRESS: {
        CLIENT_DOMAIN: process.env.CLIENT_DOMAIN ?? 'http://127.0.0.1:7000',
        CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) || [
            'http://127.0.0.1:8000',
        ],
        ENVIRONMENT: process.env.ENVIRONMENT ?? 'development',
        HOST: process.env.HOST ?? 'localhost',
        JWT_SECRET: jwtSecret,
        LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
        PORT: parseInt(process.env.PORT ?? '3000', 10),
        SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS ?? '10'),
        SERVICE_IDENTITY: process.env.SERVICE_IDENTITY ?? 'service',
        TIMEZONE: process.env.TIMEZONE ?? 'Africa/Nairobi',
    },
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/jp_backend',
};
