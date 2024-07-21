import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest =
    (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
