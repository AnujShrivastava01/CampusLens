import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'completed_with_errors', 'failed'],
    default: 'processing',
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  totalRecords: {
    type: Number,
    required: true,
    default: 0
  },
  processedRecords: {
    type: Number,
    default: 0
  },
  failedRecords: {
    type: Number,
    default: 0
  },
  headers: [{
    type: String
  }],
  uploadErrors: [{
    row: Number,
    error: String,
    data: mongoose.Schema.Types.Mixed
  }],
  completedAt: {
    type: Date
  },
}, { timestamps: true });

// Index for faster queries
fileUploadSchema.index({ createdAt: -1 });
fileUploadSchema.index({ createdBy: 1 });

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

export default FileUpload;
