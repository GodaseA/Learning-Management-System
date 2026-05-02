const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const addTestLesson = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      console.log('No course found. Please create a course first via Instructor Dashboard.');
      process.exit(1);
    }
    
    console.log(`\n📚 Course: ${course.title}`);
    console.log(`Current lessons: ${course.lessons?.length || 0}\n`);
    
    // Check if lesson already exists
    const existingLesson = await Lesson.findOne({ 
      course: course._id, 
      title: 'Introduction to Web Development' 
    });
    
    if (existingLesson) {
      console.log('Test lesson already exists!');
      console.log('Video URL:', existingLesson.videoUrl);
    } else {
      const lesson = new Lesson({
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development. This lesson covers HTML, CSS, and JavaScript basics.',
        videoUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
        duration: 10,
        order: (course.lessons?.length || 0) + 1,
        course: course._id,
        isFree: true
      });
      
      await lesson.save();
      course.lessons.push(lesson._id);
      await course.save();
      
      console.log('✅ Test lesson added successfully!');
      console.log(`Lesson: ${lesson.title}`);
      console.log(`Video URL: ${lesson.videoUrl}`);
    }
    
    console.log('\n📝 Instructions:');
    console.log('1. Login as a student');
    console.log('2. Enroll in this course');
    console.log('3. Go to My Courses');
    console.log('4. Click "Continue Learning"');
    console.log('5. The YouTube video should play!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addTestLesson();
