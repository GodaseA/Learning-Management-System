const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const testAPI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find a student
    const student = await User.findOne({ role: 'student' });
    if (student) {
      console.log('\n✅ Found student:');
      console.log(`   Name: ${student.name}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   ID: ${student._id}`);
      console.log('\n📝 Use this student ID in your API calls:');
      console.log(`   /api/enrollments/my-courses?studentId=${student._id}`);
    } else {
      console.log('\n❌ No student found. Please register a student account first.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testAPI();
