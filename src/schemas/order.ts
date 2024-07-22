import { Document, model, Schema } from 'mongoose';
import Joi from 'joi';

export enum OrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

interface ProductOrder {
    productId: string;
    quantity: number;
}

interface Order {
    orderId: number;
    userId: string;
    products: ProductOrder[];
    totalAmount: number;
    orderStatus: OrderStatus;
    orderDate: Date;
}

export interface OrderDocument extends Order, Document {}

export const placeOrderSchema = Joi.object({
    products: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
            }),
        )
        .required(),
    totalAmount: Joi.number().min(0).required(),
});

const productOrderSchema = new Schema<ProductOrder>({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new Schema<OrderDocument>({
    orderId: { type: Number, required: true, unique: true },
    userId: { type: String, required: true },
    products: [productOrderSchema],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: Object.values(OrderStatus), required: true },
    orderDate: { type: Date, default: Date.now },
});

orderSchema.pre<OrderDocument>('save', async function (next) {
    if (this.isNew) {
        const lastOrder = await Order.findOne().sort('-orderId').exec();
        this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
    }
    next();
});

export const Order = model<OrderDocument>('Order', orderSchema);
