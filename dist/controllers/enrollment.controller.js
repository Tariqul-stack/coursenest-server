"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollPaidCourse = exports.getCertificate = exports.getCourseEnrollments = exports.updateProgress = exports.getMyEnrollments = exports.enrollCourse = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Course_1 = __importDefault(require("../models/Course"));
const crypto_1 = require("crypto");
// @desc    Enroll in a course (free)
// @route   POST /api/enrollments
// @access  Student
const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user?.id;
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (!course.isFree) {
            res.status(400).json({ message: 'This is a paid course. Please complete payment first.' });
            return;
        }
        const existing = await Enrollment_1.default.findOne({ student: studentId, course: courseId });
        if (existing) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }
        const enrollment = await Enrollment_1.default.create({
            student: studentId,
            course: courseId,
            paymentStatus: 'free',
        });
        // Increment enrollment count
        await Course_1.default.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });
        res.status(201).json({ success: true, enrollment });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.enrollCourse = enrollCourse;
// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Student
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment_1.default.find({ student: req.user?.id })
            .populate({
            path: 'course',
            select: 'title thumbnail category instructor totalEnrollments averageRating curriculum',
            populate: {
                path: 'instructor',
                select: 'name avatar',
            },
        })
            .sort({ enrolledAt: -1 });
        res.status(200).json({ success: true, enrollments });
    }
    catch (error) {
        console.error('getMyEnrollments error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMyEnrollments = getMyEnrollments;
// @desc    Update lesson progress
// @route   PATCH /api/enrollments/:id/progress
// @access  Student
const updateProgress = async (req, res) => {
    try {
        const { lessonId } = req.body;
        const enrollment = await Enrollment_1.default.findById(req.params.id);
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }
        if (enrollment.student.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        // Add lesson if not already completed
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }
        // Get total lessons from course
        const course = await Course_1.default.findById(enrollment.course);
        const totalLessons = course?.curriculum?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 1;
        // Calculate progress
        enrollment.progressPercent = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
        // Issue certificate if 100%
        if (enrollment.progressPercent === 100 && !enrollment.certificateIssued) {
            enrollment.certificateIssued = true;
            enrollment.certificateId = `CN-${Date.now()}-${(0, crypto_1.randomUUID)().slice(0, 6).toUpperCase()}`;
        }
        await enrollment.save();
        res.status(200).json({ success: true, enrollment });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateProgress = updateProgress;
// @desc    Get enrollments for a course
// @route   GET /api/enrollments/course/:courseId
// @access  Teacher / Admin
const getCourseEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment_1.default.find({ course: req.params.courseId })
            .populate('student', 'name email avatar')
            .sort({ enrolledAt: -1 });
        res.status(200).json({ success: true, enrollments });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCourseEnrollments = getCourseEnrollments;
// @desc    Get certificate by ID
// @route   GET /api/enrollments/certificate/:certificateId
// @access  Public
const getCertificate = async (req, res) => {
    try {
        const enrollment = await Enrollment_1.default.findOne({
            certificateId: req.params.certificateId,
        })
            .populate('student', 'name')
            .populate({
            path: 'course',
            select: 'title',
            populate: { path: 'instructor', select: 'name' },
        });
        if (!enrollment || !enrollment.certificateIssued) {
            res.status(404).json({ message: 'Certificate not found' });
            return;
        }
        const course = enrollment.course;
        res.status(200).json({
            success: true,
            certificate: {
                studentName: enrollment.student.name,
                courseTitle: course.title,
                instructorName: course.instructor.name,
                certificateId: enrollment.certificateId,
                completedAt: enrollment.updatedAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCertificate = getCertificate;
const enrollPaidCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user?.id;
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const existing = await Enrollment_1.default.findOne({ student: studentId, course: courseId });
        if (existing) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }
        const enrollment = await Enrollment_1.default.create({
            student: studentId,
            course: courseId,
            paymentStatus: 'paid',
        });
        await Course_1.default.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } });
        res.status(201).json({ success: true, enrollment });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.enrollPaidCourse = enrollPaidCourse;
