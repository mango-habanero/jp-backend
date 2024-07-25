import { Cart, CartDocument } from '@/schemas/cart';
import { validateDocument } from '@/tools/helpers';

export const getCartByUserId = async (userId: number): Promise<CartDocument[]> => {
    const cart = await Cart.find({ userId });
    await validateDocument<CartDocument[]>(cart);
    return cart;
};

export const addItemToCart = async (
    userId: number,
    productId: string,
    quantity: number,
): Promise<CartDocument> => {
    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
        existingItem.quantity += quantity;
        return existingItem.save();
    } else {
        const newItem = new Cart({ userId, productId, quantity });
        return newItem.save();
    }
};

export const removeItemFromCart = async (userId: number, productId: string) => {
    Cart.findOneAndDelete({ userId, productId });
};
