const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'LMS API is running', database: 'MongoDB connected' });
});

// Routes - Make sure all routes are properly mounted
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler - FIXED: added quotes around the string
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found: ' + req.method + ' ' + req.url });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('Server is running on port ' + PORT);
  console.log('========================================');
  console.log('API URL: http://localhost:' + PORT);
  console.log('Database: MongoDB (suyash)');
  console.log('========================================');
  console.log('Available endpoints:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/profile');
  console.log('  GET    /api/courses');
  console.log('  POST   /api/courses');
  console.log('  GET    /api/courses/:id');
  console.log('  PUT    /api/courses/:id');
  console.log('  DELETE /api/courses/:id');
  console.log('  GET    /api/lessons/course/:courseId');
  console.log('  POST   /api/lessons/course/:courseId');
  console.log('  GET    /api/enrollments/my-courses');
  console.log('  POST   /api/enrollments/:courseId');
  console.log('  POST   /api/enrollments/complete-lesson');
  console.log('  GET    /api/enrollments/progress/:courseId');
  console.log('  GET    /api/enrollments/check/:courseId');
  console.log('========================================');
});
