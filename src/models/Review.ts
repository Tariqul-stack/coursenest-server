import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

ReviewSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);