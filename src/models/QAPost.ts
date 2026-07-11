import mongoose, { Document, Schema } from 'mongoose';

export interface IQAAnswer extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorRole: string;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
}

const QAAnswerSchema = new Schema<IQAAnswer>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'QAPost', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorRole: { type: String, required: true },
    content: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IQAAnswer>('QAAnswer', QAAnswerSchema);