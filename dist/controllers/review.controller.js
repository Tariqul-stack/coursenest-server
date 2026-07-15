"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyReviews = exports.deleteReview = exports.updateReview = exports.getCourseReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;
        // Check enrollment
        const enrollment = await Enrollment_1.default.findOne({
            student: req.user?.id,
            course: courseId,
        });
        if (!enrollment) {
            res.status(403).json({ message: 'You must be enrolled to review this course' });
            return;
        }
        // Check duplicate
        const existing = await Review_1.default.findOne({
            student: req.user?.id,
            course: courseId,
        });
        if (existing) {
            res.status(400).json({ message: 'You have already reviewed this course' });
            return;
        }
        const review = await Review_1.default.create({
            student: req.user?.id,
            course: courseId,
            rating,
            comment,
        });
        await review.populate('student', 'name avatar');
        // Update course average rating
        const allReviews = await Review_1.default.find({ course: courseId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Course_1.default.findByIdAndUpdate(courseId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: allReviews.length,
        });
        res.status(201).json({ success: true, review });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createReview = createReview;
const getCourseReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ course: req.params.courseId })
            .populate('student', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCourseReviews = getCourseReviews;
const updateReview = async (req, res) => {
    try {
        const review = await Review_1.default.findById(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        if (review.student.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        await review.save();
        await review.populate('student', 'name avatar');
        // Recalculate average
        const allReviews = await Review_1.default.find({ course: review.course });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Course_1.default.findByIdAndUpdate(review.course, {
            averageRating: Math.round(avgRating * 10) / 10,
        });
        res.status(200).json({ success: true, review });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        const review = await Review_1.default.findById(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        if (review.student.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        const courseId = review.course;
        await review.deleteOne();
        // Recalculate average
        const allReviews = await Review_1.default.find({ course: courseId });
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
            : 0;
        await Course_1.default.findByIdAndUpdate(courseId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: allReviews.length,
        });
        res.status(200).json({ success: true, message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteReview = deleteReview;
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ student: req.user?.id })
            .populate('course', 'title thumbnail')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMyReviews = getMyReviews;
