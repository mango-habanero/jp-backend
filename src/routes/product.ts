import { MESSAGES } from '@/core/constants';
import { authenticateToken, authorize } from '@/middleware/auth';
import { validatePaginatedRequest, validateRequest } from '@/middleware/validate';
import { createProductSchema, updateProductSchema } from '@/schemas/product';
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
} from '@/services/product';
import { errorResponse, handleError, successResponse } from '@/tools/helpers';
import express from 'express';

const router = express.Router();

router.get('/', validatePaginatedRequest, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string);
        const offset = parseInt(req.query.offset as string);

        const result = await getProducts(limit, offset);
        res.json(result);
    } catch (error) {
        await handleError(error, res);
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const product = await getProduct(req.params.productId);
        if (!product) {
            return await errorResponse(res, MESSAGES.PRODUCT_NOT_FOUND, 404);
        }
        res.json(product);
    } catch (error) {
        await handleError(error, res);
    }
});

router.post(
    '/',
    authenticateToken,
    authorize(['admin']),
    validateRequest(createProductSchema),
    async (req, res) => {
        try {
            const product = await createProduct(req.body);
            return await successResponse(res, [product], MESSAGES.PRODUCT_CREATED, 201);
        } catch (error) {
            await handleError(error, res);
        }
    },
);

router.put(
    '/:productId',
    authenticateToken,
    authorize(['admin']),
    validateRequest(updateProductSchema),
    async (req, res) => {
        try {
            const product = await updateProduct(req.params.productId, req.body);
            if (!product) {
                return await errorResponse(res, MESSAGES.PRODUCT_UPDATED, 404);
            }
            return await successResponse(res, [product], MESSAGES.PRODUCT_UPDATED, 200);
        } catch (error) {
            await handleError(error, res);
        }
    },
);

router.delete('/:productId', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        await deleteProduct(req.params.productId);
        return await successResponse(res, [], MESSAGES.PRODUCT_DELETED, 204);
    } catch (error) {
        await handleError(error, res);
    }
});

export default router;
