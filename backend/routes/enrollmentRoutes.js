const express = require('express');
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

// Check if student is enrolled in a course (GET method)
router.get('/check/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.query;
    
    console.log('Check enrollment - courseId:', courseId, 'studentId:', studentId);
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID required' });
    }
    
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    }).populate('course');
    
    res.json({ 
      enrolled: !!enrollment, 
      enrollment: enrollment,
      progress: enrollment ? Math.round(enrollment.progress) : 0
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get my courses with progress
router.get('/my-courses', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    
    console.log('Get my courses - studentId:', studentId);
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      })
      .sort('-enrolledAt');
    
    console.log('Found enrollments:', enrollments.length);
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching my courses:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get progress for a specific course
router.get('/progress/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.query;
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID required' });
    }
    
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    }).populate('course');
    
    if (!enrollment) {
      return res.json({ 
        enrolled: false,
        progress: 0,
        completedLessons: [],
        totalLessons: 0
      });
    }
    
    res.json({
      enrolled: true,
      progress: Math.round(enrollment.progress),
      completedLessons: enrollment.completedLessons,
      totalLessons: enrollment.course?.lessons?.length || 0
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: error.message });
  }
});


// Mark lesson as complete - FIXED VERSION
router.post('/complete-lesson', async (req, res) => {
  console.log("request abhii")
  try {
    const { studentId, courseId, lessonId } = req.body;
    
    console.log('========================================');
    console.log('COMPLETE LESSON REQUEST');
    console.log('Student ID:', studentId);
    console.log('Course ID:', courseId);
    console.log('Lesson ID:', lessonId);
    console.log('========================================');
    
    // Validate input
    if (!studentId || !courseId || !lessonId) {
      console.log('ERROR: Missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }
    
    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });
    
    if (!enrollment) {
      console.log('ERROR: Enrollment not found');
      return res.status(404).json({ 
        success: false,
        message: 'Enrollment not found. Please enroll in the course first.' 
      });
    }
    
    console.log('Enrollment found:', enrollment._id);
    console.log('Current progress:', enrollment.progress);
    console.log('Completed lessons:', enrollment.completedLessons);
    
    // Check if lesson already completed
    if (enrollment.completedLessons.includes(lessonId)) {
      console.log('Lesson already completed');
      return res.json({ 
        success: true,
        message: 'Lesson already completed', 
        progress: Math.round(enrollment.progress)
      });
    }
    
    // Add lesson to completed lessons
    enrollment.completedLessons.push(lessonId);
    
    // Get course to calculate progress
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('ERROR: Course not found');
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    const newProgress = (completedCount / totalLessons) * 100;
    
    console.log('Total lessons:', totalLessons);
    console.log('Completed count:', completedCount);
    console.log('New progress:', newProgress);
    
    enrollment.progress = newProgress;
    
    if (newProgress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
      console.log('COURSE COMPLETED!');
    }
    
    await enrollment.save();
    console.log('Enrollment saved successfully!');
    
    res.json({
      success: true,
      progress: Math.round(newProgress),
      completedLessons: completedCount,
      totalLessons: totalLessons,
      message: 'Lesson marked as complete!'
    });
  } catch (error) {
    console.error('ERROR in complete-lesson:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: error.stack
    });
  }
});



// Enroll in course (POST method)
router.post('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;
    
    console.log('Enroll request - courseId:', courseId, 'studentId:', studentId);
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: []
    });
    
    if (!course.studentsEnrolled) course.studentsEnrolled = [];
    course.studentsEnrolled.push(studentId);
    await course.save();
    
    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('course');
    
    console.log('Enrollment created:', enrollment._id);
    res.status(201).json(populatedEnrollment);
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled students with details
router.get('/course-students/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId).populate('studentsEnrolled', 'name email _id');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course.studentsEnrolled || []);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove student from course
router.delete('/remove-student/:courseId/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const enrollment = await Enrollment.findOneAndDelete({
      student: studentId,
      course: courseId
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    const course = await Course.findById(courseId);
    if (course) {
      course.studentsEnrolled = course.studentsEnrolled.filter(
        id => id.toString() !== studentId
      );
      await course.save();
    }
    
    res.json({ message: 'Student removed from course successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
