const express = require('express');
const Course = require('../models/Course');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

const router = express.Router();

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email')
      .sort('-createdAt');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('lessons');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course with image upload
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    let courseData;
    
    if (req.body.courseData) {
      courseData = JSON.parse(req.body.courseData);
    } else {
      courseData = req.body;
    }
    
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'lms-courses');
        courseData.thumbnail = result.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        courseData.thumbnail = 'https://picsum.photos/seed/' + Date.now() + '/300/200';
      }
    } else if (!courseData.thumbnail) {
      courseData.thumbnail = 'https://picsum.photos/seed/' + Date.now() + '/300/200';
    }
    
    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update course - FIXED VERSION
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    let updateData;
    if (req.body.courseData) {
      updateData = JSON.parse(req.body.courseData);
    } else {
      updateData = req.body;
    }
    
    // Handle image upload
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'lms-courses');
        updateData.thumbnail = result.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        updateData.thumbnail = 'https://picsum.photos/seed/' + Date.now() + '/300/200';
      }
    }
    
    // Update only allowed fields
    course.title = updateData.title || course.title;
    course.description = updateData.description || course.description;
    course.category = updateData.category || course.category;
    course.level = updateData.level || course.level;
    course.price = updateData.price !== undefined ? updateData.price : course.price;
    course.duration = updateData.duration !== undefined ? updateData.duration : course.duration;
    if (updateData.thumbnail) {
      course.thumbnail = updateData.thumbnail;
    }
    
    await course.save();
    
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
