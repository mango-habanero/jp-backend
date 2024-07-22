import { Order, OrderDocument, OrderStatus } from '../schemas/order';
import { FilterQuery } from 'mongoose';

export async function placeOrder(
    userId: string,
    products: { productId: string; quantity: number }[],
    totalAmount: number,
): Promise<OrderDocument> {
    const order = new Order({
        userId,
        products,
        totalAmount,
        orderStatus: OrderStatus.Pending,
    });
    await order.save();
    return order;
}

export async function getOrderHistory(cursor: string | undefined, limit: number, userId: string) {
    const query: FilterQuery<OrderDocument> = { userId };

    if (cursor) {
        query._id = { $gt: cursor };
    }

    const orders = await Order.find(query).limit(limit).sort('-orderDate').exec();

    const previousCursor = cursor && orders.length > 0 ? orders[0]._id : null;
    const nextCursor = orders.length > 0 ? orders[orders.length - 1]._id : null;

    return { data: orders, next: nextCursor, previous: previousCursor, total: orders.length };
}
