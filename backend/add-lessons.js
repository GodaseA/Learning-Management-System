const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const addLessonsToCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the web development course
    const course = await Course.findOne({ title: /Web Development/i });
    
    if (!course) {
      console.log('Course not found. Please run seed.js first.');
      process.exit(1);
    }
    
    const lessons = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn what web development is and how websites work',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 15,
        order: 1,
        course: course._id,
        isFree: true
      },
      {
        title: 'HTML Fundamentals',
        description: 'Master the basics of HTML5 including semantic elements',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 30,
        order: 2,
        course: course._id,
        isFree: false
      },
      {
        title: 'CSS Styling',
        description: 'Make your websites beautiful with modern CSS',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 45,
        order: 3,
        course: course._id,
        isFree: false
      },
      {
        title: 'JavaScript Basics',
        description: 'Learn programming fundamentals with JavaScript',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 60,
        order: 4,
        course: course._id,
        isFree: false
      }
    ];
    
    // Clear existing lessons for this course
    await Lesson.deleteMany({ course: course._id });
    
    // Add new lessons
    const createdLessons = await Lesson.insertMany(lessons);
    
    // Update course with lesson IDs
    course.lessons = createdLessons.map(l => l._id);
    await course.save();
    
    console.log(`Added ${createdLessons.length} lessons to course: ${course.title}`);
    console.log('Lessons added successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addLessonsToCourse();
