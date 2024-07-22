import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { handleError } from '../tools/helpers';
import { addItemToCart, removeItemFromCart, getCartByUserId } from '../services/cart';
import { validateRequest } from '../middleware/validate';
import { addCartItemSchema, removeCartItemSchema } from '../schemas/cart';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).send('Not logged in.');
    }
    const cart = await getCartByUserId(userId);
    res.json(cart);
});

router.post('/add', authenticateToken, validateRequest(addCartItemSchema), async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).send('Not logged in.');
        }
        const cartItem = await addItemToCart(userId, req.body.productId, req.body.quantity);
        res.status(201).json(cartItem);
    } catch (error) {
        await handleError(error, res);
    }
});

router.post(
    '/remove',
    authenticateToken,
    validateRequest(removeCartItemSchema),
    async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).send('Not logged in.');
            }
            const cartItem = await removeItemFromCart(userId, req.body.productId);
            res.status(200).json(cartItem);
        } catch (error) {
            await handleError(error, res);
        }
    },
);

export default router;
