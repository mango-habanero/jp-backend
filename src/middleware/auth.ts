// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { jwtVerify, JWTPayload } from 'jose';
import { UnauthorizedError } from '../core/errors';
import { Blacklist } from '../schemas/blacklist';
import { handleError } from '../tools/helpers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const blacklistedToken = await Blacklist.findOne({ token });
        if (blacklistedToken) {
            throw new UnauthorizedError('Token is blacklisted');
        }

        const { payload } = await jwtVerify(token, secret);
        req.user = payload;
        next();
    } catch (err) {
        await handleError(err, res);
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        if (role && roles.includes(role as string)) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    };
};
