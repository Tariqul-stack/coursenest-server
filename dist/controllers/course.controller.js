"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCourses = exports.toggleStatus = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const { search, category, level, minPrice, maxPrice, sort, page = 1, limit = 8, } = req.query;
        const query = { status: 'published' };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }
        if (category)
            query.category = category;
        if (level)
            query.level = level;
        if (req.query.instructorId)
            query.instructor = req.query.instructorId;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'popular')
            sortOption = { totalEnrollments: -1 };
        if (sort === 'rating')
            sortOption = { averageRating: -1 };
        if (sort === 'price-low')
            sortOption = { price: 1 };
        if (sort === 'price-high')
            sortOption = { price: -1 };
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const [courses, total] = await Promise.all([
            Course_1.default.find(query)
                .populate('instructor', 'name avatar')
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum),
            Course_1.default.countDocuments(query),
        ]);
        res.status(200).json({
            success: true,
            courses,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCourses = getCourses;
// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id).populate('instructor', 'name avatar bio');
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCourse = getCourse;
// @desc    Create course
// @route   POST /api/courses
// @access  Teacher
const createCourse = async (req, res) => {
    try {
        const { title, shortDescription, fullDescription, thumbnail, price, category, level, tags, } = req.body;
        const course = await Course_1.default.create({
            title,
            shortDescription,
            fullDescription,
            thumbnail,
            price: Number(price),
            isFree: Number(price) === 0,
            category,
            level,
            tags: tags || [],
            instructor: req.user?.id,
            status: 'draft',
        });
        res.status(201).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createCourse = createCourse;
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Teacher (owner)
const updateCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (course.instructor.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        if (req.body.price !== undefined) {
            req.body.isFree = Number(req.body.price) === 0;
        }
        const updated = await Course_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, course: updated });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateCourse = updateCourse;
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Teacher (owner) / Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (course.instructor.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        await course.deleteOne();
        res.status(200).json({ success: true, message: 'Course deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteCourse = deleteCourse;
// @desc    Toggle course status
// @route   PATCH /api/courses/:id/status
// @access  Teacher (owner) / Admin
const toggleStatus = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (course.instructor.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        course.status = course.status === 'published' ? 'draft' : 'published';
        await course.save();
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.toggleStatus = toggleStatus;
// @desc    Get teacher's own courses
// @route   GET /api/courses/my-courses
// @access  Teacher
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course_1.default.find({ instructor: req.user?.id }).sort({
            createdAt: -1,
        });
        res.status(200).json({ success: true, courses });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMyCourses = getMyCourses;
