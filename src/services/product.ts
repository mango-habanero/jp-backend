import { Product, ProductDocument } from '../schemas/product';
import { FilterQuery } from 'mongoose';

export async function createProduct(productData: Partial<ProductDocument>) {
    return Product.create(productData);
}

export async function getProduct(productId: string) {
    return await Product.findOne({ productId: productId }).exec();
}

export async function getProducts(cursor: string | undefined, limit: number) {
    const query: FilterQuery<ProductDocument> = {};
    if (cursor) {
        query._id = { $gt: cursor };
    }

    const products = await Product.find(query).limit(limit);

    const previousCursor = cursor && products.length > 0 ? products[0]._id : null;
    const nextCursor = products.length > 0 ? products[products.length - 1]._id : null;

    return { data: products, next: nextCursor, previous: previousCursor, total: products.length };
}

export async function updateProduct(productId: string, updateData: Partial<ProductDocument>) {
    return Product.findOneAndUpdate({ productId }, updateData, { new: true });
}

export async function deleteProduct(productId: string) {
    return Product.findOneAndDelete({ productId });
}
