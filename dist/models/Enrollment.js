import mongoose, { Schema } from 'mongoose';
const EnrollmentSchema = new Schema({
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
}, { timestamps: true });
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
