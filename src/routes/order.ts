import { MESSAGES } from '@/core/constants';
import { authenticateToken } from '@/middleware/auth';
import { validatePaginatedRequest, validateRequest } from '@/middleware/validate';
import { placeOrderSchema } from '@/schemas/order';
import { getOrderHistory, placeOrder } from '@/services/order';
import { handleError, successResponse, validateRequestField } from '@/tools/helpers';
import express from 'express';

const router = express.Router();

router.post('/', authenticateToken, validateRequest(placeOrderSchema), async (req, res) => {
    const userId = await validateRequestField(req.user?.userId, res, MESSAGES.INVALID_REQUEST, 400);
    try {
        const order = await placeOrder(userId, req.body.products, req.body.products.totalAmount);
        res.status(201).json(order);
    } catch (error) {
        await handleError(error, res);
    }
});

router.get('/history', authenticateToken, validatePaginatedRequest, async (req, res) => {
    try {
        const userId = await validateRequestField(
            req.user?.userId,
            res,
            MESSAGES.INVALID_REQUEST,
            401,
        );

        const limit = parseInt(req.query.limit as string);
        const offset = parseInt(req.query.offset as string);

        const orders = await getOrderHistory(offset, limit, userId);
        return await successResponse(res, orders, MESSAGES.ORDER_HISTORY_LOADED_SUCCESSFULLY);
    } catch (error) {
        await handleError(error, res);
    }
});

export default router;
