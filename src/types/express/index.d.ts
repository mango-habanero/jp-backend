import { JWTPayload } from 'jose';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JWTPayload;
    }
}
