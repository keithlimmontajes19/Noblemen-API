import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
    isVerified: { type: Boolean, default: false }
})

export const Token = mongoose.model('Token', tokenSchema);