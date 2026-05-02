const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({ isPublished: true }).populate('lessons');
    
    if (courses.length === 0) {
      console.log('No courses found!');
      return;
    }
    
    for (const course of courses) {
      console.log(`Course: ${course.title}`);
      console.log(`  ID: ${course._id}`);
      console.log(`  Lessons: ${course.lessons?.length || 0}`);
      
      if (course.lessons && course.lessons.length > 0) {
        console.log('  Lessons:');
        course.lessons.forEach(lesson => {
          console.log(`    - ${lesson.title} (ID: ${lesson._id})`);
        });
      } else {
        console.log('  No lessons in this course!');
        console.log('  Please add lessons via Instructor Dashboard');
      }
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkCourses();
