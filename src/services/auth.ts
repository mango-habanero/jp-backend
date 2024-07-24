import { sendEmail } from './mailer';
import { getUserByEmail } from './user';

import { config } from '@/config';
import { MESSAGES } from '@/core/constants';
import { BadRequestError, UnauthorizedError } from '@/core/errors';
import { logger } from '@/core/logger';
import { Blacklist } from '@/schemas/blacklist';
import { User } from '@/schemas/user';
import { UserPayload } from '@/types/express';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { MongoError } from 'mongodb';

export async function blackListToken(token: string) {
    await Blacklist.create({ token });
}

export async function checkBlacklist(token: string): Promise<void> {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
        throw new UnauthorizedError('Token is blacklisted');
    }
}

export async function generateToken(payload: UserPayload, expiry: string): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiry)
        .sign(config.EXPRESS.JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload & JWTPayload> {
    await checkBlacklist(token);
    try {
        const { payload } = await jwtVerify<UserPayload>(token, config.EXPRESS.JWT_SECRET);
        return payload;
    } catch (error) {
        throw new UnauthorizedError(`${MESSAGES.INVALID_TOKEN}: ${error}`);
    }
}

export async function generateUserTokens(
    email: string,
    role: string,
    userId: number,
): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await generateToken({ email, role, userId }, '2h');
    const refreshToken = await generateToken({ email, role, userId }, '7d');
    return { accessToken, refreshToken };
}

export async function getRefreshToken(refreshToken: string) {
    const payload = await verifyToken(refreshToken);
    await blackListToken(refreshToken);

    return await generateUserTokens(payload.email, payload.role, payload.userId);
}

export async function loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);

    if (!user.isVerified) throw new UnauthorizedError('User is not verified, verify email.');

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);

    return await generateUserTokens(email, user.role, user.userId);
}

export async function logoutUser(accessToken: string, refreshToken: string) {
    await verifyToken(refreshToken);

    await Blacklist.create({ token: accessToken }, { token: refreshToken });
}

export async function registerUser(email: string, name: string, password: string, role: string) {
    await User.init();
    try {
        await User.create({ email, name, password, role });
    } catch (err) {
        if (err instanceof MongoError && err.code === 11000) {
            throw new BadRequestError(MESSAGES.EMAIL_ALREADY_IN_USE);
        } else {
            throw err;
        }
    }
}

export async function resetPassword(token: string, newPassword: string) {
    const payload = await verifyToken(token);
    const user = await getUserByEmail(payload.email);

    user.password = newPassword;
    return await user.save();
}

export async function sendForgotPasswordEmail(email: string) {
    const user = await getUserByEmail(email);

    const resetToken = await generateToken(
        { email: user.email, role: user.role, userId: user.userId },
        '1h',
    );
    const resetLink = `${config.EXPRESS.CLIENT_DOMAIN}/auth/reset-password?token=${resetToken}`;
    const subject = 'Password Reset';
    const text = `Reset your password by clicking the following link: ${resetLink}`;

    if (config.EXPRESS.ENVIRONMENT === 'development') {
        logger.info(`Reset Token: ${resetToken}`);
    } else {
        await sendEmail(email, subject, text);
    }
}

export async function sendVerificationEmail(email: string) {
    const user = await getUserByEmail(email);

    const verificationToken = await generateToken(
        { email: user.email, role: user.role, userId: user.userId },
        '1h',
    );
    const verificationLink = `${config.EXPRESS.CLIENT_DOMAIN}/auth/verify-email?token=${verificationToken}`;
    const subject = 'Email Verification';
    const text = `Verify your email by clicking the following link: ${verificationLink}`;

    if (config.EXPRESS.ENVIRONMENT === 'development') {
        logger.info(`Verification Token: ${verificationToken}`);
    } else {
        await sendEmail(email, subject, text);
    }
}

export async function verifyEmail(token: string) {
    const payload = await verifyToken(token);
    const user = await getUserByEmail(payload.email);

    user.isVerified = true;
    return await user.save();
}
