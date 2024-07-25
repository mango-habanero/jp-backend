import { paginationSchema } from '@/schemas/pagination';
import { errorResponse, handleError } from '@/tools/helpers';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest =
    (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message);
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
