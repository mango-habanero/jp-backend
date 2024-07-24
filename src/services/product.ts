import { IProduct, Product, ProductDocument } from '@/schemas/product';
import { getPaginatedResults, handleDatabaseError, validateDocument } from '@/tools/helpers';

export async function createProduct(data: IProduct) {
    await Product.init();
    try {
        const product = await Product.create(data);
        return await validateDocument<ProductDocument>(product);
    } catch (error) {
        await handleDatabaseError(error);
    }
}

export async function getProduct(productId: string) {
    return Product.findOne({ productId: productId }).select('-__v');
}

export async function getProducts(offset: number, limit: number) {
    return getPaginatedResults<ProductDocument>(Product, offset, limit);
}

export async function updateProduct(productId: string, updateData: Partial<IProduct>) {
    return await Product.findOneAndUpdate({ productId }, updateData, { new: true })
        .sort('-__v')
        .exec();
}

export async function deleteProduct(productId: string) {
    Product.findOneAndDelete({ productId });
}
