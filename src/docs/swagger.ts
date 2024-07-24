import { config } from '@/config';
import fs from 'fs';
import swaggerAutogen from 'swagger-autogen';

const packageJson = JSON.parse(fs.readFileSync(`${config.BASE_DIR}/package.json`, 'utf-8'));

const doc = {
    info: {
        version: packageJson.version,
        title: packageJson.name,
        description: packageJson.description,
    },
    servers: [
        {
            url: `${config.EXPRESS.HOST}:${config.EXPRESS.PORT}`,
            description: 'Documentation of the APIs.',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
};

const outputFile = './swagger.json';
const endpointsFiles = ['../routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
