import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { handleError } from '../tools/helpers';
import { placeOrder, getOrderHistory } from '../services/order';
import { validatePaginatedRequest, validateRequest } from '../middleware/validate';
import { placeOrderSchema } from '../schemas/order';

const router = express.Router();

router.post('/', authenticateToken, validateRequest(placeOrderSchema), async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).send('Not logged in.');
        }
        const order = await placeOrder(userId, req.body.products, req.body.products.totalAmount);
        res.status(201).json(order);
    } catch (error) {
        await handleError(error, res);
    }
});

router.get('/history', authenticateToken, validatePaginatedRequest, async (req, res) => {
    try {
        const cursor = req.query.cursor as string;
        const limit = parseInt(req.query.limit as string);

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).send('Not logged in.');
        }
        const orders = await getOrderHistory(cursor, limit, userId);
        res.json(orders);
    } catch (error) {
        await handleError(error, res);
    }
});

export default router;
