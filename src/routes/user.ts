import { MESSAGES } from '@/core/constants';
import { authenticateToken } from '@/middleware/auth';
import { getUserById } from '@/services/user';
import { handleError, successResponse, validateRequestField } from '@/tools/helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = await validateRequestField(
            req.user?.userId,
            res,
            MESSAGES.INVALID_REQUEST,
            400,
        );
        const user = await getUserById(userId);
        return await successResponse(res, [user], 'Successfully retrieved user data');
    } catch (err) {
        await handleError(err, res);
    }
});

export default router;
