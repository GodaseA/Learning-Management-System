const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import models in correct order
require('./models/User');
require('./models/Course');
require('./models/Lesson');
require('./models/Enrollment');

const Course = mongoose.model('Course');
const Lesson = mongoose.model('Lesson');

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({ isPublished: true }).populate('lessons');
    
    if (courses.length === 0) {
      console.log('No courses found!');
      console.log('Please create a course through the Instructor Dashboard first.\n');
      process.exit(0);
    }
    
    for (const course of courses) {
      console.log('========================================');
      console.log(Course: );
      console.log(  ID: );
      console.log(  Instructor: );
      console.log(  Lessons Count: );
      
      if (course.lessons && course.lessons.length > 0) {
        console.log('  Lessons:');
        course.lessons.forEach((lesson, index) => {
          console.log(    .  (ID: ));
          console.log(       Duration:  min);
          console.log(       Video: );
        });
      } else {
        console.log('  ⚠️ No lessons in this course!');
        console.log('  Please add lessons via Instructor Dashboard');
      }
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

checkCourses();
