import mongoose, { Document, Schema } from 'mongoose';

export interface IQAPost extends Document {
  author: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  tags: string[];
  status: 'open' | 'resolved';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQAAnswer extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorRole: string;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
}

const QAPostSchema = new Schema<IQAPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

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

export const QAPost = mongoose.models.QAPost || mongoose.model<IQAPost>('QAPost', QAPostSchema);
export const QAAnswer = mongoose.models.QAAnswer || mongoose.model<IQAAnswer>('QAAnswer', QAAnswerSchema);