import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './lib/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect Database
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CourseNest Server Running ✅' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});