import { CustomError } from '../core/errors';
import { Response } from 'express';

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

export async function handleError(err: unknown, res: Response) {
    if (err instanceof CustomError) {
        res.status(err.statusCode).send(err.message);
    } else {
        const errorMessage = getErrorMessage(err);
        res.status(500).send(errorMessage);
    }
}
