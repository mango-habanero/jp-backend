import { User, UserDocument } from '@/schemas/user';
import { validateDocument } from '@/tools/helpers';

export async function getUserByEmail(email: string): Promise<UserDocument> {
    const user = await User.findOne({ email }).select('-password -__v');
    return validateDocument<UserDocument>(user);
}

export async function getUserById(userId: number): Promise<UserDocument> {
    const user = await User.findOne({ userId }).select('-password -__v');
    return validateDocument<UserDocument>(user);
}
