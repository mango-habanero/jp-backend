import { Cart, CartDocument } from '../schemas/cart';

export const getCartByUserId = async (userId: string): Promise<CartDocument[]> => {
    return Cart.find({ userId });
};

export const addItemToCart = async (
    userId: string,
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

export const removeItemFromCart = async (
    userId: string,
    productId: string,
): Promise<CartDocument | null> => {
    return Cart.findOneAndDelete({ userId, productId });
};
