const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const addWorkingLesson = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      console.log('❌ No course found. Please create a course first.');
      process.exit(1);
    }
    
    console.log(`\n📚 Found course: ${course.title}`);
    
    // Delete existing lessons to avoid duplicates
    await Lesson.deleteMany({ course: course._id });
    course.lessons = [];
    await course.save();
    
    // Add working YouTube lessons
    const lessons = [
      {
        title: 'Introduction to the Course',
        description: 'Welcome to this course! Watch this introduction to understand what you will learn.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 3,
        order: 1,
        course: course._id,
        isFree: true
      },
      {
        title: 'Getting Started',
        description: 'Learn the basics and set up your development environment.',
        videoUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
        duration: 15,
        order: 2,
        course: course._id,
        isFree: true
      },
      {
        title: 'Core Concepts',
        description: 'Dive deep into the core concepts and best practices.',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        duration: 25,
        order: 3,
        course: course._id,
        isFree: false
      }
    ];
    
    for (const lessonData of lessons) {
      const lesson = new Lesson(lessonData);
      await lesson.save();
      course.lessons.push(lesson._id);
      console.log(`✅ Added: ${lesson.title}`);
    }
    
    await course.save();
    
    console.log(`\n✅ Added ${lessons.length} lessons to the course!`);
    console.log('\n📝 Test Instructions:');
    console.log('1. Restart your frontend if running');
    console.log('2. Login as a student');
    console.log('3. Enroll in this course');
    console.log('4. Go to My Courses');
    console.log('5. Click "Continue Learning"');
    console.log('6. The YouTube video should now play!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addWorkingLesson();
