// Load environment variables
require('dotenv').config();

// Simple MongoDB connection test
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://CampusLens:anuj8120725888@anuj.6bfpcvs.mongodb.net/campuslens?retryWrites=true&w=majority';
  
  console.log('🔍 Testing MongoDB connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // Mask password in the connection string for security
  const maskedUri = uri.replace(/:([^@]+)@/, ':***@');
  console.log('🔗 MongoDB URI:', maskedUri);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  
  try {
    console.log('\n🔌 Attempting to connect to MongoDB...');
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('\n📊 Available databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
    
    // List collections in the campuslens database
    const db = client.db('campuslens');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📋 Collections in campuslens database:');
    if (collections.length > 0) {
      collections.forEach(collection => console.log(`- ${collection.name}`));
    } else {
      console.log('No collections found. The database is empty.');
    }
    
    // Test a simple query
    try {
      const count = await db.collection('students').countDocuments();
      console.log(`\n📊 Found ${count} student records`);
    } catch (queryError) {
      console.log('\nℹ️  Could not query students collection (it might not exist yet)');
    }
    
  } catch (error) {
    console.error('\n❌ MongoDB connection error:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n⚠️  Server selection error. Possible causes:');
      console.error('1. Your IP is not whitelisted in MongoDB Atlas');
      console.error('2. The MongoDB server is not running');
      console.error('3. Network connectivity issues');
      console.error('4. Invalid connection string');
    } else if (error.name === 'MongoNetworkError') {
      console.error('\n⚠️  Network error. Check your internet connection and firewall settings.');
    } else if (error.name === 'MongoParseError') {
      console.error('\n⚠️  Connection string parse error. Check your MONGODB_URI format.');
    } else if (error.name === 'MongoError' && error.codeName === 'AuthenticationFailed') {
      console.error('\n⚠️  Authentication failed. Check your username and password.');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

testConnection();
