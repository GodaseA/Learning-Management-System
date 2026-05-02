const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const createInstructor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    // Check if instructor exists
    const existingInstructor = await User.findOne({ email: 'teacher@example.com' });
    
    if (existingInstructor) {
      console.log('✅ Instructor already exists!');
      console.log('Email: teacher@example.com');
      console.log('Password: password123');
    } else {
      // Create instructor
      const instructor = await User.create({
        name: 'Demo Teacher',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'instructor'
      });
      
      console.log('✅ Instructor created successfully!');
      console.log('Name: Demo Teacher');
      console.log('Email: teacher@example.com');
      console.log('Password: password123');
      console.log('Role: Instructor');
    }
    
    console.log('\n📝 Login with instructor account:');
    console.log('   Email: teacher@example.com');
    console.log('   Password: password123');
    console.log('\nYou will NOT see "My Courses" or "Enroll" buttons.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createInstructor();
