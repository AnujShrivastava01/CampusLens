import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Import routes
import studentRoutes from './routes/students.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import { requireAuth, getAuthUser } from './middleware/auth.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration with more permissive settings for development
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:8080', // Add support for port 8080
      'http://localhost:8081', // Add support for port 8081
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080', // Add support for port 8080
      'http://127.0.0.1:8081' // Add support for port 8081
    ];

    if (!origin || allowedOrigins.some(allowedOrigin =>
      origin.startsWith(allowedOrigin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['*']
};

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Authentication middleware - REAL Clerk authentication
const authMiddleware = (req, res, next) => {
  // For file uploads, we'll handle auth differently because of multipart/form-data
  if (req.path.includes('/upload/excel') && req.method === 'POST') {
    // Skip auth middleware for upload route - it will handle auth internally
    return next();
  }

  // Apply Clerk authentication for other routes
  return ClerkExpressRequireAuth()(req, res, next);
};

// Routes with authentication
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/upload', uploadRoutes); // Upload routes handle auth internally
app.use('/api/admin', adminRoutes);

// Add root route to fix "Route not found" error
app.get('/', (req, res) => {
  res.json({
    message: 'CampusLens API Server is running!',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      students: '/api/students',
      upload: '/api/upload'
    },
    timestamp: new Date().toISOString()
  });
});

// Helper function to mask sensitive information in connection string
function maskMongoDBUri(uri) {
  if (!uri) return 'undefined';
  // Mask password in the connection string
  return uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, (match, srv, user) =>
    `mongodb${srv || ''}://${user}:***@`
  );
}

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('🔵 Attempting to connect to MongoDB...');

    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }

    // Log masked connection string for security
    console.log('🔗 MongoDB URI:', maskMongoDBUri(process.env.MONGODB_URI));

    // Set mongoose debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`🔍 ${collectionName}.${method}`, JSON.stringify(query), doc || '');
      });
    }

    // Add connection event listeners with timestamps
    const startTime = Date.now();

    mongoose.connection.on('connecting', () => {
      console.log(`[${new Date().toISOString()}] 🔄 Connecting to MongoDB...`);
    });

    mongoose.connection.on('connected', () => {
      const elapsed = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ✅ MongoDB connected successfully! (${elapsed}ms)`);
      // Log connection details
      const conn = mongoose.connection;
      console.log(`📊 Host: ${conn.host}:${conn.port}`);
      console.log(`📂 Database: ${conn.name}`);
      console.log(`👤 User: ${conn.user || 'none'}`);
      console.log(`🔌 Connection state: ${conn.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ❌ MongoDB connection error:`, err.message);
      console.error('Error details:', {
        name: err.name,
        code: err.code,
        codeName: err.codeName,
        errorLabels: err.errorLabels,
        stack: err.stack
      });
    });

    mongoose.connection.on('disconnected', () => {
      console.log(`[${new Date().toISOString()}] ℹ️  MongoDB disconnected`);
    });

    // Connection options - simplified to match working test
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    };

    console.log('🔌 Connection options:', {
      ...options,
      // Don't log sensitive info
      authSource: 'admin',
      ssl: process.env.MONGODB_URI.includes('ssl=true')
    });

    console.log('⏳ Attempting to establish connection...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    // Verify the connection by pinging the database
    await conn.connection.db.admin().ping();
    console.log('✅ Successfully connected and authenticated with MongoDB');

    return conn;
  } catch (error) {
    const errorTime = new Date().toISOString();
    console.error(`[${errorTime}] ❌ Database connection failed!`);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n🔍 This is a server selection error. Possible causes:');
      console.error('1. The MongoDB server is not running or not accessible');
      console.error('2. The connection string is incorrect or malformed');
      console.error('3. Your IP is not whitelisted in MongoDB Atlas');
      console.error('4. Network connectivity issues or firewall blocking');
      console.error('5. Authentication failed (invalid credentials)');
      console.error('6. The MongoDB server is still starting up');

      // Additional diagnostic information
      console.error('\n🔍 Diagnostic information:');
      console.error('- Connection string:', maskMongoDBUri(process.env.MONGODB_URI));
      console.error('- Environment:', process.env.NODE_ENV || 'development');
      console.error('- Node.js version:', process.version);
      console.error('- Platform:', process.platform, process.arch);
    }

    // Don't exit immediately, let the application handle the error
    throw error;
  }
};

// Connect to database with retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

// Function to sync admin credentials from .env
const syncAdminCredentials = async () => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.log('⚠️ ADMIN_USERNAME or ADMIN_PASSWORD not set in .env, skipping admin sync.');
      return;
    }
    const Admin = (await import('./models/Admin.js')).default;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log(`👤 Creating admin user '${username}' from .env...`);
      await Admin.create({ username, password });
      console.log('✅ Admin user created successfully.');
    } else {
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        console.log(`🔄 Updating password for admin '${username}' to match .env...`);
        admin.password = password;
        admin.tokenVersion = (admin.tokenVersion || 0) + 1; // Invalidate all previous tokens
        await admin.save();
        console.log('✅ Admin password updated successfully (Sessions invalidated).');
      } else {
        console.log('✅ Admin credentials are in sync with .env');
      }
    }
  } catch (error) {
    console.error('❌ Failed to sync admin credentials:', error.message);
  }
};


// Temporary: Bypass authentication for development testing
// TODO: Fix Clerk secret key and re-enable proper authentication
const tempBypassAuth = (req, res, next) => {
  req.auth = { userId: 'temp-user-for-testing' };
  next();
};

app.use('/api/students', tempBypassAuth, studentRoutes);
app.use('/api/upload', tempBypassAuth, uploadRoutes);

// Temporary debug endpoint to create test data
app.get('/api/debug/create-test-data/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const FileUpload = (await import('./models/FileUpload.js')).default;
    const Student = (await import('./models/Student.js')).default;

    // Clear existing students for this file
    await Student.deleteMany({ uploadId: fileId });

    // Create test data
    const testStudents = [
      { 'Student Name': 'SHREECHA JHA', 'Contact No.': '6200710476', 'Branch': 'AIDS' },
      { 'Student Name': 'ABHAY PRATAP SINGH', 'Contact No.': '6266091871', 'Branch': 'ET' },
      { 'Student Name': 'NANDINI YADAV', 'Contact No.': '7223813472', 'Branch': 'EC' },
      { 'Student Name': 'RAHUL KUMAR', 'Contact No.': '9876543210', 'Branch': 'CSE' },
      { 'Student Name': 'PRIYA SHARMA', 'Contact No.': '8765432109', 'Branch': 'IT' }
    ];

    // Save test students
    for (let i = 0; i < testStudents.length; i++) {
      const student = new Student({
        studentId: `TEST${Date.now()}_${i}`, // Generate unique studentId
        email: `test${Date.now()}_${i}@example.com`, // Generate unique email
        _rawData: testStudents[i],
        uploadId: fileId,
        rowNumber: i + 2,
        createdBy: 'temp-user-for-testing',
        createdAt: new Date()
      });
      await student.save();
    }

    // Update file stats
    const file = await FileUpload.findById(fileId);
    if (file) {
      file.processedRecords = testStudents.length;
      file.failedRecords = Math.max(0, file.totalRecords - testStudents.length);
      await file.save();
    }

    res.json({
      success: true,
      message: `Created ${testStudents.length} test students for file ${fileId}`,
      students: testStudents.length
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test data',
      error: error.message
    });
  }
});

// Add temporary public upload route for testing
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/public/upload-test', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Simple file info response
    res.json({
      message: 'File upload test successful',
      file: {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload test error:', error);
    res.status(500).json({
      error: 'Upload test failed',
      message: error.message
    });
  }
});

// Add public test routes (temporary for debugging)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Add a public stats route for testing
app.get('/api/public/stats', async (req, res) => {
  try {
    const totalStudents = await mongoose.connection.db.collection('students').countDocuments();
    const totalFiles = await mongoose.connection.db.collection('fileuploads').countDocuments();

    res.json({
      totalStudents,
      totalFiles,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
});

// Add public file access routes for debugging
app.get('/api/public/files', async (req, res) => {
  try {
    const files = await mongoose.connection.db.collection('fileuploads').find({}).toArray();
    res.json({
      files: files.map(file => ({
        _id: file._id,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        createdAt: file.createdAt,
        uploadedBy: file.uploadedBy || file.createdBy
      })),
      count: files.length
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      error: 'Failed to fetch files',
      message: error.message
    });
  }
});

// Add public students access route for debugging
app.get('/api/public/students', async (req, res) => {
  try {
    const students = await mongoose.connection.db.collection('students').find({}).limit(10).toArray();
    res.json({
      students: students.map(student => ({
        _id: student._id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        program: student.program,
        year: student.year
      })),
      count: students.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      error: 'Failed to fetch students',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CampusLens API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Debug endpoint to test data for a specific user
app.get('/api/debug/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get files for this user
    const files = await FileUpload.find({
      createdBy: userId,
      status: { $in: ['completed', 'completed_with_errors'] }
    }).limit(5);

    // Get students for this user  
    const students = await Student.find({
      createdBy: userId
    }).limit(5);

    res.json({
      success: true,
      debug: {
        userId,
        filesCount: files.length,
        studentsCount: students.length,
        files: files.map(f => ({
          id: f._id,
          filename: f.filename,
          headers: f.headers,
          status: f.status
        })),
        students: students.map(s => ({
          id: s._id,
          rawDataKeys: Object.keys(s._rawData || {}),
          uploadId: s.uploadId
        }))
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
// Connect to MongoDB and start server
connectDB().then(async () => {
  // Sync admin credentials
  await syncAdminCredentials();

  app.listen(PORT, () => {
    console.log(`🚀 CampusLens API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});
