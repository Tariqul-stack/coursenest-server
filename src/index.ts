import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './lib/db';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CourseNest Server Running ✅' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});