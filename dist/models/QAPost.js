import mongoose, { Schema } from 'mongoose';
const QAPostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    views: { type: Number, default: 0 },
}, { timestamps: true });
const QAAnswerSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'QAPost', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorRole: { type: String, required: true },
    content: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
}, { timestamps: true });
export const QAPost = mongoose.models.QAPost || mongoose.model('QAPost', QAPostSchema);
export const QAAnswer = mongoose.models.QAAnswer || mongoose.model('QAAnswer', QAAnswerSchema);
