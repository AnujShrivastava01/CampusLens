import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import FileUpload from './models/FileUpload.js';

dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const students = await Student.find({}).limit(5);
    console.log('Found students:', students.map(s => ({
      id: s._id,
      name: s.firstName + ' ' + s.lastName,
      email: s.email,
      uploadId: s.uploadId,
      rawDataKeys: Object.keys(s._rawData || {})
    })));
    
    // Check for FileUpload documents too
    const files = await FileUpload.find({}).limit(5);
    console.log('Found files:', files.map(f => ({
      id: f._id,
      filename: f.filename,
      originalName: f.originalName,
      recordCount: f.recordCount
    })));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

checkData();
