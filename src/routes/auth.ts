import express, { Request, Response } from 'express';
import { validateRequest } from '../middleware/validate';
import {
    forgotPasswordSchema,
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from '../schemas/auth';
import {
    getRefreshToken,
    loginUser,
    logoutUser,
    registerUser,
    sendForgotPasswordEmail,
    sendVerificationEmail,
    verifyEmail,
} from '../services/auth';

import { handleError } from '../tools/helpers';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body;

    try {
        await registerUser(email, name, password, role);
        await sendVerificationEmail(email);
        res.status(201).send('User registered. Verification email sent.');
    } catch (err) {
        await handleError(err, res);
    }
});

router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await loginUser(email, password);
        res.json({ accessToken, refreshToken });
    } catch (err) {
        await handleError(err, res);
    }
});

router.get('/verify-email', async (req: Request, res: Response) => {
    const { token } = req.query;

    try {
        await verifyEmail(token as string);
        res.status(200).send('Email verified successfully');
    } catch (err) {
        await handleError(err, res);
    }
});

router.post(
    '/forgot-password',
    validateRequest(forgotPasswordSchema),
    async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            await sendForgotPasswordEmail(email);
            res.status(200).send('Password reset email sent.');
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
            res.json({ accessToken, refreshToken });
        } catch (err) {
            await handleError(err, res);
        }
    },
);

router.post('/logout', async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { refreshToken } = req.body;

    if (!accessToken || !refreshToken) {
        return res.status(401).send('No tokens provided');
    }

    try {
        await logoutUser(accessToken, refreshToken);
        res.status(200).send('User logged out successfully');
    } catch (err) {
        await handleError(err, res);
    }
});

export default router;
