import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  paymentStatus: 'free' | 'paid';
  transactionId?: mongoose.Types.ObjectId;
  completedLessons: string[];
  progressPercent: number;
  certificateIssued: boolean;
  certificateId?: string;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    completedLessons: [{ type: String }],
    progressPercent: { type: Number, default: 0 },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment as mongoose.Model<IEnrollment> || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
