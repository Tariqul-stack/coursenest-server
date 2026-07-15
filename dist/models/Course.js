"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const LessonSchema = new mongoose_1.Schema({
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    order: { type: Number, required: true },
    isFreePreview: { type: Boolean, default: false },
});
const ModuleSchema = new mongoose_1.Schema({
    moduleId: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    lessons: [LessonSchema],
});
const CourseSchema = new mongoose_1.Schema({
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
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    curriculum: [ModuleSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    totalEnrollments: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Course', CourseSchema);
