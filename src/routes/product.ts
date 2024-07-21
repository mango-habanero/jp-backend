import express from 'express';
import { validatePaginatedRequest, validateRequest } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../schemas/product';
import { authenticateToken, authorize } from '../middleware/auth';
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
} from '../services/product';
import { handleError } from '../tools/helpers';

const router = express.Router();

router.get('/', validatePaginatedRequest, async (req, res) => {
    try {
        const cursor = req.query.cursor as string;
        const limit = parseInt(req.query.limit as string);

        const result = await getProducts(cursor, limit);
        res.json(result);
    } catch (error) {
        await handleError(error, res);
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const product = await getProduct(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        await handleError(error, res);
    }
});

router.post('/', authorize(['admin']), validateRequest(createProductSchema), async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        await handleError(error, res);
    }
});

router.put(
    '/:productId',
    authenticateToken,
    authorize(['admin']),
    validateRequest(updateProductSchema),
    async (req, res) => {
        try {
            const product = await updateProduct(req.params.productId, req.body);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            await handleError(error, res);
        }
    },
);

router.delete('/:productId', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const product = await deleteProduct(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).end();
    } catch (error) {
        await handleError(error, res);
    }
});

export default router;
