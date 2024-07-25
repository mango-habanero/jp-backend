import { MESSAGES } from '@/core/constants';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validate';
import {
    forgotPasswordSchema,
    loginSchema,
    logoutSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordSchema,
    verifyEmailSchema,
} from '@/schemas/auth';
import {
    generateUserTokens,
    getRefreshToken,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    sendForgotPasswordEmail,
    sendVerificationEmail,
    verifyEmail,
} from '@/services/auth';
import { errorResponse, handleError, successResponse } from '@/tools/helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
    '/forgot-password',
    validateRequest(forgotPasswordSchema),
    async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            await sendForgotPasswordEmail(email);
            return await successResponse(res, [], MESSAGES.PASSWORD_RESET_EMAIL_SENT);
        } catch (err) {
            await handleError(err, res);
        }
    },
);

router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await loginUser(email, password);
        return await successResponse(
            res,
            [{ accessToken, refreshToken }],
            MESSAGES.LOGIN_SUCCESSFUL,
        );
    } catch (err) {
        await handleError(err, res);
    }
});

router.post(
    '/logout',
    authenticateToken,
    validateRequest(logoutSchema),
    async (req: Request, res: Response) => {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const { refreshToken } = req.body;

        if (!accessToken || !refreshToken) {
            return errorResponse(res, MESSAGES.NO_TOKENS_PROVIDED, 401);
        }

        try {
            await logoutUser(accessToken, refreshToken);
            return await successResponse(res, [], MESSAGES.USER_LOGGED_OUT_SUCCESSFULLY);
        } catch (err) {
            await handleError(err, res);
        }
    },
);

router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body;

    try {
        await registerUser(email, name, password, role);
        await sendVerificationEmail(email);
        return await successResponse(res, [], MESSAGES.USER_REGISTERED_VERIFICATION_EMAIL_SENT);
    } catch (err) {
        await handleError(err, res);
    }
});

router.post(
    '/reset-password',
    validateRequest(resetPasswordSchema),
    async (req: Request, res: Response) => {
        const { token, newPassword } = req.body;

        try {
            await resetPassword(token, newPassword);
            return await successResponse(res, [], MESSAGES.PASSWORD_RESET_SUCCESS);
        } catch (err) {
            await handleError(err, res);
        }
    },
);

router.post(
    '/refresh-token',
    validateRequest(refreshTokenSchema),
    async (req: Request, res: Response) => {
        const { token } = req.body;

        try {
            const { accessToken, refreshToken } = await getRefreshToken(token);
            return await successResponse(
                res,
                [{ accessToken, refreshToken }],
                MESSAGES.TOKEN_REFRESHED,
            );
        } catch (err) {
            await handleError(err, res);
        }
    },
);

router.post(
    '/verify-email',
    validateRequest(verifyEmailSchema),
    async (req: Request, res: Response) => {
        const { token } = req.body;

        try {
            const user = await verifyEmail(token as string);
            if (!user) {
                return errorResponse(res, MESSAGES.USER_NOT_FOUND, 404);
            }
            const { accessToken, refreshToken } = await generateUserTokens(
                user.email,
                user.role,
                user.userId,
            );
            return await successResponse(
                res,
                [
                    {
                        accessToken,
                        refreshToken,
                        user,
                    },
                ],
                MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
            );
        } catch (err) {
            await handleError(err, res);
        }
    },
);

export default router;
