import { Document, model, Schema } from 'mongoose';

interface BlacklistDocument extends Document {
    token: string;
    createdAt: Date;
}

const blacklistSchema = new Schema<BlacklistDocument>({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' },
});

export const Blacklist = model<BlacklistDocument>('Blacklist', blacklistSchema);
