import Joi from 'joi';
import { Document, model, Schema } from 'mongoose';

interface Product {
    category: string;
    description: string;
    imageUrl: string;
    name: string;
    price: number;
    productId: number;
    stockQuantity: number;
}

export interface ProductDocument extends Product, Document {}

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    category: Joi.string().optional(),
});

const productSchema = new Schema<ProductDocument>({
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productId: { type: Number, unique: true, required: true },
    stockQuantity: { type: Number, required: true },
});

export const Product = model<ProductDocument>('Product', productSchema);
