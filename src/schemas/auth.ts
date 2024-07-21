import Joi from 'joi';

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    role: Joi.string().valid('admin', 'user').default('user'),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
});

export const verifyEmailSchema = Joi.object({
    token: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
});

export const refreshTokenSchema = Joi.object({
    body: Joi.object({
        token: Joi.string().required(),
    }),
});
