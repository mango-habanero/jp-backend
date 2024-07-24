import Joi from 'joi';

export const paginationSchema = Joi.object({
    limit: Joi.number().optional().default(25).min(1).max(100),
    offset: Joi.number().optional().default(1),
});
