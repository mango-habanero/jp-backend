import { NextFunction, Request, Response } from 'express';
import { JWTPayload, jwtVerify } from 'jose';
import { UnauthorizedError } from '../core/errors';
import { Blacklist } from '../schemas/blacklist';
import { handleError } from '../tools/helpers';
import { config } from '../config';
import { UserPayload } from '../types/express';
import { logger } from '../core/logger';

export interface AuthenticatedRequest extends Request {
    user?: UserPayload & JWTPayload;
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

        try {
            const { payload } = await jwtVerify<UserPayload>(token, config.EXPRESS.JWT_SECRET);
            req.user = payload;
            next();
        } catch (error) {
            logger.error(`Invalid Token: ${error}`);
            throw new UnauthorizedError('Invalid Token.');
        }
    } catch (err) {
        await handleError(err, res);
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        if (role && roles.includes(role)) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    };
};
