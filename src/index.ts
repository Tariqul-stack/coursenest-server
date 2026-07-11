import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './lib/db';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import adminRoutes from './routes/admin.routes';
import qaRoutes from './routes/qa.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qa', qaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CourseNest Server Running ✅' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});