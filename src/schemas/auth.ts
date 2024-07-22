import Joi from 'joi';

const PASSWORD_PATTERN = /^[a-zA-Z0-9!@#$%^&*()]{3,30}$/;

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_PATTERN).required(),
});

export const verifyEmailSchema = Joi.object({
    token: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const refreshTokenSchema = Joi.object({
    token: Joi.string().required(),
});
