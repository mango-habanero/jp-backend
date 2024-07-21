import Joi from 'joi';

export const paginationSchema = Joi.object({
    cursor: Joi.string().optional(),
    limit: Joi.number().optional().default(10).min(1).max(100),
});
