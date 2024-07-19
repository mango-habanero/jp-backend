import { Document, Model, model, Schema } from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import bcrypt from 'bcrypt';
import { config } from '../config';

export enum Role {
    admin = 'admin',
    user = 'user',
}

interface User {
    email: string;
    name: string;
    password: string;
    role: Role;
    userId: number;
}

interface UserDocument extends User, Document {
    matchPassword: (password: string) => Promise<boolean>;
}

type UserModel = Model<UserDocument>;

const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    name: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    role: {
        default: Role.user,
        enum: Object.values(Role),
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: Number,
        unique: true,
    },
});

userSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.plugin(AutoIncrementID, { field: 'userId', startAt: 1 });

userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(config.EXPRESS.SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<UserDocument, UserModel>('User', userSchema);
