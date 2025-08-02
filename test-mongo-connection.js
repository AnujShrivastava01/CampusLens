const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Mask the password in the connection string for logging
function maskConnectionString(uri) {
  return uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, (match, srv, user) => 
    `mongodb${srv || ''}://${user}:***@`
  );
}

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Connection string:', maskConnectionString(process.env.MONGODB_URI));
    
    // Set up event listeners
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Connecting to MongoDB...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully!');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️  MongoDB disconnected');
    });
    
    // Try to connect with the connection string
    console.log('Attempting to connect...');
    
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // If we get here, connection was successful
    console.log('\n✅ Successfully connected to MongoDB!');
    console.log('Host:', connection.connection.host);
    console.log('Database:', connection.connection.name);
    
    // List all collections to verify access
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('\n📂 Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Close the connection
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n🔍 This is a server selection error. Possible causes:');
      console.error('1. The MongoDB server is not running or not accessible');
      console.error('2. The connection string is incorrect or malformed');
      console.error('3. Your IP is not whitelisted in MongoDB Atlas');
      console.error('4. Network connectivity issues or firewall blocking');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();
