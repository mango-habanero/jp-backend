import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

export interface CartDocument extends Document {
    userId: number;
    productId: number;
    quantity: number;
}

export const addCartItemSchema = Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export const removeCartItemSchema = Joi.object({
    productId: Joi.number().required(),
});

const cartSchema = new Schema<CartDocument>({
    userId: { type: Number, required: true },
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

export const Cart = mongoose.model<CartDocument>('Cart', cartSchema);
