import { Order, OrderDocument, OrderStatus } from '@/schemas/order';
import { getPaginatedResults, handleDatabaseError, validateDocument } from '@/tools/helpers';
import { FilterQuery } from 'mongoose';

export async function placeOrder(
    userId: number,
    products: { productId: string; quantity: number }[],
    totalAmount: number,
) {
    await Order.init();
    try {
        const order = await Order.create({
            userId,
            products,
            totalAmount,
            orderStatus: OrderStatus.Pending,
        });
        return await validateDocument<OrderDocument>(order);
    } catch (error) {
        await handleDatabaseError(error);
    }
}

export async function getOrderHistory(offset: number, limit: number, userId: number) {
    const query: FilterQuery<OrderDocument> = { userId };

    return getPaginatedResults<OrderDocument>(Order, offset, limit, query, 'orderDate');
}
