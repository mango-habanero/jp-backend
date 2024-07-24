import { JWTPayload } from 'jose';

export interface UserPayload {
    email: string;
    role: string;
    userId: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload & JWTPayload;
    }
}
