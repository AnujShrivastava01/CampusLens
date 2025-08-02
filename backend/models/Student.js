import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Common fields (will be auto-populated if matching headers are found)
  studentId: {
    type: String,
    trim: true,
    sparse: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true  // Allow multiple null values
  },
  phone: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    trim: true,
    index: true
  },
  
  // Raw data storage for all columns
  _rawData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Metadata
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileUpload',
    index: true
  },
  rowNumber: {
    type: Number,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a text index on _rawData for searching
studentSchema.index({ '_rawData.$**': 'text' });

// Add a pre-save hook to update the updatedAt field
studentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add a method to get all unique field names across documents
studentSchema.statics.getFieldNames = async function() {
  const fields = new Set();
  
  // Get all documents and collect field names
  const docs = await this.find({}).lean();
  docs.forEach(doc => {
    if (doc._rawData) {
      Object.keys(doc._rawData).forEach(field => fields.add(field));
    }
  });
  
  return Array.from(fields);
};

// Add a method to search across all fields
studentSchema.statics.search = async function(query, filters = {}) {
  const searchQuery = {
    $or: [
      { $text: { $search: query } },
      { '_rawData.$**': { $regex: query, $options: 'i' } }
    ],
    ...filters
  };
  
  return this.find(searchQuery);
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
