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
      console.log('❌ No course found. Please create a course first via Instructor Dashboard.');
      process.exit(1);
    }
    
    console.log(`\n📚 Found course: ${course.title}`);
    
    // Working YouTube video (Introduction to Web Development)
    const workingLesson = {
      title: '🎬 Sample YouTube Video - Introduction',
      description: 'This is a sample YouTube video to test the player. If you can see this video, the YouTube player is working correctly!',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 3,
      order: (course.lessons?.length || 0) + 1,
      course: course._id,
      isFree: true
    };
    
    const lesson = new Lesson(workingLesson);
    await lesson.save();
    course.lessons.push(lesson._id);
    await course.save();
    
    console.log('\n✅ Test lesson added successfully!');
    console.log(`Lesson: ${lesson.title}`);
    console.log(`Video URL: ${lesson.videoUrl}`);
    console.log(`\n📝 To test:`);
    console.log(`1. Login as a student`);
    console.log(`2. Enroll in "${course.title}"`);
    console.log(`3. Go to My Courses`);
    console.log(`4. Click "Continue Learning"`);
    console.log(`5. Click on the new lesson "${lesson.title}"`);
    console.log(`6. The YouTube video should now play!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addWorkingLesson();
