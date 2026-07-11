import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 8,
    } = req.query;

    const query: any = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalEnrollments: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Course.countDocuments(query),
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name avatar bio'
    );
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Teacher
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      thumbnail,
      price,
      category,
      level,
      tags,
    } = req.body;

    const course = await Course.create({
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Teacher (owner)
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
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

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ success: true, course: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Teacher (owner) / Admin
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Toggle course status
// @route   PATCH /api/courses/:id/status
// @access  Teacher (owner) / Admin
export const toggleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get teacher's own courses
// @route   GET /api/courses/my-courses
// @access  Teacher
export const getMyCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({ instructor: req.user?.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};