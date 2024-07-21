import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { User } from '../schemas/user';
import { config } from '../config';
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from '../core/errors';
import { logger } from '../core/logger';
import { MongoError } from 'mongodb';
import { sendEmail } from './mailer';
import { Blacklist } from '../schemas/blacklist';

export async function registerUser(email: string, name: string, password: string, role: string) {
    await User.init();
    try {
        await User.create({ email, name, password, role });
    } catch (err) {
        if (err instanceof MongoError && err.code === 11000) {
            throw new BadRequestError('Email already in use.');
        } else {
            throw err;
        }
    }
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError('Cannot find user');
    }

    if (!user.get('isVerified')) {
        throw new UnauthorizedError('User is not verified, verify email.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = await new SignJWT({
        userId: user.userId,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(config.EXPRESS.JWT_SECRET);

    const refreshToken = await new SignJWT({
        userId: user.userId,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d') // Set the expiration time for the refresh token
        .sign(config.EXPRESS.JWT_SECRET);

    return { accessToken, refreshToken };
}

export async function sendVerificationEmail(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const verificationToken = await new SignJWT({ userId: user.userId, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(config.EXPRESS.JWT_SECRET);

    const verificationLink = `${config.EXPRESS.CLIENT_DOMAIN}/auth/verify-email?token=${verificationToken}`;
    const subject = 'Email Verification';
    const text = `Verify your email by clicking the following link: ${verificationLink}`;

    if (config.EXPRESS.ENVIRONMENT === 'development') {
        logger.info(`Verification Token: ${JSON.stringify(verificationToken)}`);
    } else {
        await sendEmail(email, subject, text);
    }
}

export async function verifyEmail(token: string) {
    try {
        const { payload } = await jwtVerify(token, config.EXPRESS.JWT_SECRET);
        const user = await User.findOne({ email: payload.email });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        user.isVerified = true;
        await user.save();
    } catch (err) {
        throw new BadRequestError('Invalid or expired token');
    }
}

export async function sendForgotPasswordEmail(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const resetToken = await new SignJWT({ userId: user.userId, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(config.EXPRESS.JWT_SECRET);

    const resetLink = `${config.EXPRESS.CLIENT_DOMAIN}/auth/reset-password?token=${resetToken}`;
    const subject = 'Password Reset';
    const text = `Reset your password by clicking the following link: ${resetLink}`;

    if (config.EXPRESS.ENVIRONMENT === 'development') {
        logger.info(`Refresh Token: ${JSON.stringify(resetToken)}`);
    } else {
        await sendEmail(email, subject, text);
    }
}

export async function getRefreshToken(refreshToken: string) {
    try {
        const blacklistedToken = await Blacklist.findOne({ token: refreshToken });
        if (blacklistedToken) {
            throw new BadRequestError('Refresh token is blacklisted');
        }

        const { payload } = await jwtVerify(refreshToken, config.EXPRESS.JWT_SECRET);

        const blacklistedRefreshToken = new Blacklist({ token: refreshToken });
        await blacklistedRefreshToken.save();

        const newAccessToken = await new SignJWT({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(config.EXPRESS.JWT_SECRET);

        const newRefreshToken = await new SignJWT({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d') // Set the expiration time for the new refresh token
            .sign(config.EXPRESS.JWT_SECRET);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        throw new BadRequestError('Invalid or expired refresh token');
    }
}

export async function logoutUser(accessToken: string, refreshToken: string) {
    try {
        await jwtVerify(accessToken, config.EXPRESS.JWT_SECRET);
        await jwtVerify(refreshToken, config.EXPRESS.JWT_SECRET);

        await Blacklist.init();
        await Blacklist.create({ token: accessToken }, { token: refreshToken });
    } catch (err) {
        throw new InternalServerError('Error logging out user');
    }
}
