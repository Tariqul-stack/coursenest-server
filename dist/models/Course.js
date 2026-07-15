import mongoose, { Schema } from 'mongoose';
const LessonSchema = new Schema({
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    order: { type: Number, required: true },
    isFreePreview: { type: Boolean, default: false },
});
const ModuleSchema = new Schema({
    moduleId: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    lessons: [LessonSchema],
});
const CourseSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    shortDescription: { type: String, required: true, maxlength: 200 },
    fullDescription: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    category: {
        type: String,
        required: true,
        enum: ['Web Development', 'UI/UX Design', 'Data Science', 'Digital Marketing', 'Mobile Development', 'Cybersecurity', 'Business', 'Photography'],
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    tags: [{ type: String }],
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    curriculum: [ModuleSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    totalEnrollments: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Course', CourseSchema);
