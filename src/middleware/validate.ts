import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { paginationSchema } from '../schemas/pagination';
import { handleError } from '../tools/helpers';

export const validateRequest =
    (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };

export const validatePaginatedRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = paginationSchema.validate(req.query);
        req.query = validated.value;
        next();
    } catch (error) {
        await handleError(error, res);
    }
};
