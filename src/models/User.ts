import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  bio: string;
  googleId?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: 'https://i.ibb.co/4pDNDk1/avatar.png',
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },
    googleId: {
      type: String,
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);