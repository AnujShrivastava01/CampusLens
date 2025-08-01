import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Basic Information
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  
  // Academic Information
  program: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: true
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.0
  },
  credits: {
    type: Number,
    default: 0
  },
  
  // Contact Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Academic Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Suspended', 'Withdrawn'],
    default: 'Active'
  },
  
  // Courses (references to Course model if you create one later)
  courses: [{
    courseId: String,
    courseName: String,
    grade: String,
    credits: Number,
    semester: String,
    year: Number
  }],
  
  // Additional Data (for Excel imports with custom fields)
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Metadata
  createdBy: {
    type: String, // Clerk user ID
    required: true
  },
  updatedBy: {
    type: String // Clerk user ID
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better search performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ firstName: 1, lastName: 1 });
studentSchema.index({ program: 1, year: 1 });
studentSchema.index({ createdBy: 1 });

// Pre-save middleware
studentSchema.pre('save', function(next) {
  // Capitalize first letter of names
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
