const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');

const testAPI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const course = await Course.findOne({ isPublished: true });
    if (course) {
      console.log(`Course ID: ${course._id}`);
      console.log(`Test URL: http://localhost:5000/api/lessons/course/${course._id}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testAPI();
