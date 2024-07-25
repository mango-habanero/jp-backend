import Joi from 'joi';

const PASSWORD_PATTERN = /^[a-zA-Z0-9!@#$%^&*()]{3,30}$/;

const tokenSchema = Joi.object({
    token: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required(),
});

export const logoutSchema = Joi.object({
    token: Joi.string().required(),
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().pattern(PASSWORD_PATTERN).required(),
});

export const refreshTokenSchema = tokenSchema;

export const verifyEmailSchema = tokenSchema;
