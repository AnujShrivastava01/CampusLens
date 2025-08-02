import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import FileUpload from './models/FileUpload.js';

dotenv.config();

async function createTestDataForUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create a sample user ID (this should match what's generated in frontend)
    const userId = 'temp-user-1732876834892-abcd12345'; // We'll use a fixed one for testing
    
    // First, create a file upload record
    const fileUpload = new FileUpload({
      filename: 'Sample Student Data.xlsx',
      originalName: 'Sample Student Data.xlsx',
      size: 15432,
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      path: '/uploads/sample.xlsx',
      status: 'completed',
      totalRecords: 3,
      processedRecords: 3,
      failedRecords: 0,
      headers: ['Student Name', 'Email', 'Contact No.', 'Branch', 'Year'],
      createdBy: userId,
      completedAt: new Date()
    });
    
    await fileUpload.save();
    console.log('Created file upload:', fileUpload._id);
    
    // Create sample student records
    const sampleStudents = [
      {
        studentId: 'STU001',
        email: 'john.doe@example.com',
        uploadId: fileUpload._id,
        rowNumber: 1,
        createdBy: userId,
        _rawData: {
          'Student Name': 'John Doe',
          'Email': 'john.doe@example.com',
          'Contact No.': '+1234567890',
          'Branch': 'Computer Science',
          'Year': '3'
        }
      },
      {
        studentId: 'STU002',
        email: 'jane.smith@example.com',
        uploadId: fileUpload._id,
        rowNumber: 2,
        createdBy: userId,
        _rawData: {
          'Student Name': 'Jane Smith',
          'Email': 'jane.smith@example.com',
          'Contact No.': '+1234567891',
          'Branch': 'Electrical Engineering',
          'Year': '2'
        }
      },
      {
        studentId: 'STU003',
        email: 'bob.johnson@example.com',
        uploadId: fileUpload._id,
        rowNumber: 3,
        createdBy: userId,
        _rawData: {
          'Student Name': 'Bob Johnson',
          'Email': 'bob.johnson@example.com',
          'Contact No.': '+1234567892',
          'Branch': 'Mechanical Engineering',
          'Year': '4'
        }
      }
    ];
    
    await Student.insertMany(sampleStudents);
    console.log('Created sample student records');
    
    console.log('\nTo test this data:');
    console.log('1. Open your browser developer tools');
    console.log('2. Go to Application/Storage > Local Storage');
    console.log(`3. Set "temp-user-id" to: ${userId}`);
    console.log('4. Refresh the Files page');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

createTestDataForUser();
