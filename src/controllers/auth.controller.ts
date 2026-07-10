import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate JWT Token
const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please fill all fields' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: 'Please fill all fields' });
      return;
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};