const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const createTestEnrollment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    const studentId = '69f4b74855c8dab2764364c0';
    console.log('Student ID:', studentId);
    
    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      console.log('Student not found!');
      process.exit(1);
    }
    console.log('Student:', student.name, '(' + student.email + ')');
    
    // Find a course to enroll in
    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      console.log('No courses found. Please create a course first.');
      process.exit(1);
    }
    console.log('Course:', course.title);
    
    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: course._id
    });
    
    if (existing) {
      console.log('\n✅ Student is already enrolled in this course!');
      console.log('Progress:', existing.progress + '%');
    } else {
      // Create enrollment
      const enrollment = await Enrollment.create({
        student: studentId,
        course: course._id,
        progress: 0,
        completedLessons: []
      });
      
      // Add student to course
      course.studentsEnrolled.push(studentId);
      await course.save();
      
      console.log('\n✅ Enrollment created successfully!');
      console.log('Enrollment ID:', enrollment._id);
    }
    
    console.log('\n📝 Now go to: http://localhost:3000/my-courses');
    console.log('You should see the enrolled course with progress 0%\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createTestEnrollment();
