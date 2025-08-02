import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function testSimpleConnection() {
  try {
    console.log('🔍 Testing simple MongoDB connection...');
    console.log('🔗 MongoDB URI:', process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':***@'));
    
    // Simple connection options
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    };
    
    console.log('⏳ Attempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📊 Host:', mongoose.connection.host);
    console.log('📂 Database:', mongoose.connection.name);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('SSL')) {
      console.error('\n🔍 SSL/TLS Error detected. Trying with different SSL options...');
    }
    
    process.exit(1);
  }
}

testSimpleConnection();
