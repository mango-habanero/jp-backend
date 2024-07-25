import { MESSAGES } from '@/core/constants';
import { BadRequestError, CustomError, InternalServerError, NotFoundError } from '@/core/errors';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Document, FilterQuery, Model, SortOrder } from 'mongoose';

export const errorResponse = async (res: Response, error: unknown, statusCode = 500) => {
    return res.status(statusCode).json({
        status: 1,
        message: error instanceof Error ? error.message : error,
    });
};

export async function getPaginatedResults<T extends Document>(
    model: Model<T>,
    offset: number,
    limit: number,
    query: FilterQuery<T> = {},
    sortField: keyof T = '_id',
    sortOrder: SortOrder = -1,
): Promise<{ results: T[]; total: number; offset: number; limit: number } | undefined> {
    try {
        const total = await model.countDocuments(query).exec();
        const results = await model
            .find(query)
            .skip(offset)
            .limit(limit)
            .sort({ [sortField]: sortOrder })
            .exec();

        return { limit, offset, total, results };
    } catch (error) {
        await handleDatabaseError(error);
    }
}

export async function handleDatabaseError(
    error: unknown,
    message = MESSAGES.DUPLICATE_DATABASE_ENTRY,
): Promise<Error> {
    if (error instanceof MongoError) {
        if (error.code === 11000) {
            throw new BadRequestError(message);
        } else {
            throw new InternalServerError(`Database error: ${error.message}`);
        }
    }
    throw error;
}

export const handleError = async (err: unknown, res: Response) => {
    if (err instanceof CustomError) {
        await errorResponse(res, err, err.statusCode);
    } else {
        await errorResponse(res, err, 500);
    }
};

export const successResponse = async (
    res: Response,
    data: unknown,
    message = 'Success',
    statusCode = 200,
) => {
    return res.status(statusCode).json({
        status: 0,
        message,
        data,
    });
};

export async function validateDocument<T>(
    document: T | null,
    errorMessage: string = MESSAGES.DOCUMENT_NOT_FOUND,
): Promise<T> {
    if (!document) throw new NotFoundError(errorMessage);
    return document;
}

export async function validateRequestField<T>(
    field: T | undefined,
    res: Response,
    errorMessage: string,
    statusCode = 400,
): Promise<T> {
    if (!field) {
        await errorResponse(res, errorMessage, statusCode);
        throw new Error(errorMessage);
    }
    return field;
}
