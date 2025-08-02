const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://CampusLens:anuj8120725888@anuj.6bfpcvs.mongodb.net/campuslens?retryWrites=true&w=majority';

console.log('🔍 Checking MongoDB connection...');
console.log('Environment:', process.env.NODE_ENV || 'development');

async function testConnection() {
  try {
    console.log('🔵 Attempting to connect to MongoDB...');
    console.log(`🔗 MongoDB URI: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error code name:', error.codeName);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n⚠️  DNS resolution failed. Check your internet connection and DNS settings.');
    } else if (error.code === 'ETIMEOUT') {
      console.error('\n⚠️  Connection timeout. Check if your IP is whitelisted in MongoDB Atlas.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Connection refused. The server might be down or the port is blocked.');
    } else if (error.codeName === 'AuthenticationFailed') {
      console.error('\n⚠️  Authentication failed. Check your username and password in the connection string.');
    }
    
    process.exit(1);
  }
}

testConnection();
