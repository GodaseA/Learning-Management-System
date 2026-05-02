const express = require('express');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

const router = express.Router();

// Get all lessons for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
    console.log('Found lessons:', lessons.length, 'for course:', req.params.courseId);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single lesson
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lesson
router.post('/course/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const lesson = new Lesson({ ...req.body, course: course._id });
    await lesson.save();
    
    course.lessons.push(lesson._id);
    await course.save();
    
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update lesson
router.put('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    Object.assign(lesson, req.body);
    await lesson.save();
    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete lesson
router.delete('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Remove lesson from course using MongoDB pull operator
    await Course.updateOne(
      { _id: lesson.course },
      { '$pull': { lessons: lesson._id } }
    );
    
    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;