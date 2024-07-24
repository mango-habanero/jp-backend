import { MESSAGES } from '@/core/constants';
import { checkBlacklist, verifyToken } from '@/services/auth';
import { errorResponse, handleError } from '@/tools/helpers';
import { UserPayload } from '@/types/express';
import { NextFunction, Request, Response } from 'express';
import { JWTPayload } from 'jose';

export interface AuthenticatedRequest extends Request {
    user?: UserPayload & JWTPayload;
}

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        await errorResponse(res, MESSAGES.NO_TOKENS_PROVIDED, 400);
        return;
    }

    try {
        await checkBlacklist(token);
        req.user = await verifyToken(token);
        next();
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
            res.status(403).json({
                message: MESSAGES.NOT_AUTHORIZED,
                status: 1,
            });
        }
    };
};
