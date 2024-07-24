import { MESSAGES } from '@/core/constants';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validate';
import { addCartItemSchema, removeCartItemSchema } from '@/schemas/cart';
import { addItemToCart, getCartByUserId, removeItemFromCart } from '@/services/cart';
import { handleError, successResponse, validateRequestField } from '@/tools/helpers';
import express from 'express';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const userId = await validateRequestField(req.user?.userId, res, MESSAGES.INVALID_REQUEST, 400);
    try {
        const cart = await getCartByUserId(userId);
        return await successResponse(res, cart, MESSAGES.CART_LOADED_SUCCESSFULLY);
    } catch (error) {
        await handleError(error, res);
    }
});

router.post('/add', authenticateToken, validateRequest(addCartItemSchema), async (req, res) => {
    const userId = await validateRequestField(req.user?.userId, res, MESSAGES.INVALID_REQUEST, 400);
    try {
        const cartItem = await addItemToCart(userId, req.body.productId, req.body.quantity);
        return await successResponse(res, [cartItem], MESSAGES.ADDED_TO_CART_SUCCESSFULLY);
    } catch (error) {
        await handleError(error, res);
    }
});

router.post(
    '/remove',
    authenticateToken,
    validateRequest(removeCartItemSchema),
    async (req, res) => {
        const userId = await validateRequestField(
            req.user?.userId,
            res,
            MESSAGES.INVALID_REQUEST,
            401,
        );
        try {
            await removeItemFromCart(userId, req.body.productId);
            return await successResponse(res, [], MESSAGES.REMOVED_FROM_CART_SUCCESSFULLY, 204);
        } catch (error) {
            await handleError(error, res);
        }
    },
);

export default router;
