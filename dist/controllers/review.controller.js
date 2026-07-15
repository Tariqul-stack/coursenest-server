import Review from '../models/Review';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
export const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;
        // Check enrollment
        const enrollment = await Enrollment.findOne({
            student: req.user?.id,
            course: courseId,
        });
        if (!enrollment) {
            res.status(403).json({ message: 'You must be enrolled to review this course' });
            return;
        }
        // Check duplicate
        const existing = await Review.findOne({
            student: req.user?.id,
            course: courseId,
        });
        if (existing) {
            res.status(400).json({ message: 'You have already reviewed this course' });
            return;
        }
        const review = await Review.create({
            student: req.user?.id,
            course: courseId,
            rating,
            comment,
        });
        await review.populate('student', 'name avatar');
        // Update course average rating
        const allReviews = await Review.find({ course: courseId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Course.findByIdAndUpdate(courseId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: allReviews.length,
        });
        res.status(201).json({ success: true, review });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const getCourseReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('student', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
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
        const allReviews = await Review.find({ course: review.course });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Course.findByIdAndUpdate(review.course, {
            averageRating: Math.round(avgRating * 10) / 10,
        });
        res.status(200).json({ success: true, review });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
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
        const allReviews = await Review.find({ course: courseId });
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
            : 0;
        await Course.findByIdAndUpdate(courseId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: allReviews.length,
        });
        res.status(200).json({ success: true, message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ student: req.user?.id })
            .populate('course', 'title thumbnail')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
