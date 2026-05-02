const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const addYouTubeLesson = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find any course
    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      console.log('No courses found. Please create a course first.');
      process.exit(1);
    }
    
    console.log(`Adding lesson to course: ${course.title}`);
    
    // Sample YouTube video (Introduction to Web Development)
    const lesson = new Lesson({
      title: 'Introduction to Web Development',
      description: 'Learn what web development is and how websites work. This lesson covers HTML, CSS, and JavaScript basics.',
      videoUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
      duration: 15,
      order: (course.lessons?.length || 0) + 1,
      course: course._id,
      isFree: true
    });
    
    await lesson.save();
    
    // Add lesson to course
    if (!course.lessons) course.lessons = [];
    course.lessons.push(lesson._id);
    await course.save();
    
    console.log('✅ Lesson added successfully!');
    console.log(`Lesson: ${lesson.title}`);
    console.log(`Video URL: ${lesson.videoUrl}`);
    console.log('\nNow login as a student and test the video!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addYouTubeLesson();
