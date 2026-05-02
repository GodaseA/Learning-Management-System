const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');

const fixCourseImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({});
    
    for (const course of courses) {
      if (!course.thumbnail || course.thumbnail.includes('placeholder') || course.thumbnail.includes('via.placeholder')) {
        course.thumbnail = `https://picsum.photos/seed/${course._id}/300/200`;
        await course.save();
        console.log(`✅ Fixed image for: ${course.title}`);
      }
    }
    
    console.log(`\n✅ Fixed ${courses.length} courses`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixCourseImages();
