import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Student from '../models/Student.js';
import FileUpload from '../models/FileUpload.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Auth middleware for routes that need it
const requireAuth = ClerkExpressRequireAuth();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Helper function to get user ID from Clerk auth
const getUserId = (req) => {
  return req.auth?.userId || null;
};

// Helper function to store dynamic Excel data
const processExcelRow = (row, headers, createdBy) => {
  const data = { 
    _rawData: {},
    createdBy: createdBy,
    createdAt: new Date()
  };

  // Store all columns from the Excel file exactly as they are
  headers.forEach(header => {
    if (row[header] !== undefined && row[header] !== null) {
      // Store the value as-is, converting to string if needed for consistency
      data._rawData[header] = row[header];
    }
  });

  // Generate a unique ID for the row if no obvious ID exists
  const possibleIdFields = ['ID', 'id', 'Student ID', 'StudentID', 'student_id', 'Roll No', 'Roll Number'];
  let rowId = null;
  
  for (const field of possibleIdFields) {
    if (data._rawData[field]) {
      rowId = data._rawData[field];
      break;
    }
  }
  
  // If no ID found, generate one based on row data
  if (!rowId) {
    const firstValue = Object.values(data._rawData)[0];
    rowId = firstValue ? `ROW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : `EMPTY_${Date.now()}`;
  }
  
  // Store the identified ID for easier searching
  data.studentId = rowId;

  return data;
};

// Helper function to get upload statistics
const getUploadStats = async (userId) => {
  const stats = await FileUpload.aggregate([
    {
      $match: {
        createdBy: userId,
        status: { $in: ['completed', 'completed_with_errors'] }
      }
    },
    {
      $group: {
        _id: null,
        totalUploads: { $sum: 1 },
        lastUpload: { $max: '$createdAt' }
      }
    }
  ]);

  return {
    totalUploads: stats[0]?.totalUploads || 0,
    lastUpload: stats[0]?.lastUpload || null
  };
};

// GET /api/upload/stats - Get upload statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get upload statistics for the user
    const stats = await getUploadStats(userId);
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching upload stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch upload statistics' 
    });
  }
});

// GET /api/upload/files - Get all uploaded files for a user
router.get('/files', requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get all files uploaded by the user
    const files = await FileUpload.find({
      createdBy: userId,
      status: { $in: ['completed', 'completed_with_errors'] }
    })
    .select('filename size status totalRecords processedRecords failedRecords createdAt completedAt')
    .sort({ createdAt: -1 }); // Most recent first
    
    res.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Error fetching upload files:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch upload files',
      error: error.message 
    });
  }
});

// GET /api/upload/files/:fileId/errors - Get error details for a specific file
router.get('/files/:fileId/errors', requireAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Verify the file exists and belongs to the user
    const file = await FileUpload.findOne({ 
      _id: fileId, 
      createdBy: userId 
    });
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found or you do not have permission to access it' 
      });
    }

    res.json({
      success: true,
      errors: file.uploadErrors || [],
      totalErrors: file.uploadErrors ? file.uploadErrors.length : 0,
      failedRecords: file.failedRecords,
      processedRecords: file.processedRecords,
      totalRecords: file.totalRecords
    });
  } catch (error) {
    console.error('Error fetching file errors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch file errors',
      error: error.message 
    });
  }
});

// GET /api/upload/files/:fileId/columns - Get available columns for a file
router.get('/files/:fileId/columns', requireAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Verify the file exists and belongs to the user
    const file = await FileUpload.findOne({ 
      _id: fileId, 
      createdBy: userId 
    });
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found or you do not have permission to access it' 
      });
    }

    // Get sample data to understand column types
    const sampleStudent = await Student.findOne({ uploadId: fileId });
    
    const columns = file.headers.map(header => {
      let dataType = 'text';
      let sampleValue = null;
      
      if (sampleStudent && sampleStudent._rawData && sampleStudent._rawData[header] !== undefined) {
        sampleValue = sampleStudent._rawData[header];
        
        // Try to determine data type
        if (typeof sampleValue === 'number') {
          dataType = 'number';
        } else if (typeof sampleValue === 'boolean') {
          dataType = 'boolean';
        } else if (sampleValue && typeof sampleValue === 'string') {
          // Check if it looks like a date
          const dateRegex = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/;
          if (dateRegex.test(sampleValue)) {
            dataType = 'date';
          } else if (!isNaN(parseFloat(sampleValue))) {
            dataType = 'number';
          } else if (sampleValue.toLowerCase() === 'true' || sampleValue.toLowerCase() === 'false') {
            dataType = 'boolean';
          }
        }
      }
      
      return {
        name: header,
        type: dataType,
        sampleValue: sampleValue
      };
    });

    res.json({
      success: true,
      columns,
      totalColumns: columns.length
    });
  } catch (error) {
    console.error('Error fetching file columns:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch file columns',
      error: error.message 
    });
  }
});

// GET /api/upload/files/:fileId/data - Get student data for a specific file
router.get('/files/:fileId/data', requireAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { page = 1, limit = 50, search, filters } = req.query;
    
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Verify the file exists and belongs to the user
    const file = await FileUpload.findOne({ 
      _id: fileId, 
      createdBy: userId 
    });
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found or you do not have permission to access it' 
      });
    }

    // Build query for students
    const query = { uploadId: fileId };
    
    // Add search functionality across all raw data fields
    if (search) {
      // Get all possible fields from headers for this file
      const searchConditions = [
        { 'studentId': { $regex: search, $options: 'i' } }
      ];
      
      // Add search across all raw data fields dynamically
      if (file.headers && file.headers.length > 0) {
        file.headers.forEach(header => {
          searchConditions.push({
            [`_rawData.${header}`]: { $regex: search, $options: 'i' }
          });
        });
      }
      
      query.$or = searchConditions;
    }
    
    // Add filters if provided - support dynamic column filtering
    if (filters) {
      try {
        const filterObj = JSON.parse(filters);
        Object.entries(filterObj).forEach(([key, value]) => {
          if (value && value !== '') {
            // Check if it's a raw data field (column from Excel)
            if (file.headers && file.headers.includes(key)) {
              query[`_rawData.${key}`] = { $regex: value, $options: 'i' };
            } else if (key === 'studentId') {
              query[key] = { $regex: value, $options: 'i' };
            } else {
              // Fallback for any other fields
              query[key] = { $regex: value, $options: 'i' };
            }
          }
        });
      } catch (e) {
        console.warn('Invalid filters format:', e);
      }
    }

    // Get total count for pagination
    const total = await Student.countDocuments(query);
    
    // Get paginated results
    const students = await Student.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ rowNumber: 1 });

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        file: {
          id: file._id,
          filename: file.filename,
          status: file.status,
          totalRecords: file.totalRecords,
          processedRecords: file.processedRecords,
          failedRecords: file.failedRecords,
          headers: file.headers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch file data',
      error: error.message 
    });
  }
});

// POST /api/upload/excel - Upload and process Excel file
router.post('/excel', upload.single('file'), requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const createdBy = userId;
    let fileUpload;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log('Excel file parsing results:');
    console.log('Sheet name:', sheetName);
    console.log('Raw data length:', data.length);
    console.log('First 3 rows:', data.slice(0, 3));

    if (data.length <= 1) { // 1 because first row is header
      return res.status(400).json({ success: false, message: 'Excel file is empty or has no data rows' });
    }

    // Get headers from first row and clean them up
    const headers = data[0]
      .map(h => (h ? h.toString().trim() : ''))
      .filter(h => h); // Remove empty headers

    console.log('Extracted headers:', headers);

    if (headers.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid headers found in the Excel file' });
    }
    
    // Create a new file upload record
    fileUpload = new FileUpload({
      filename: req.file.originalname,
      size: req.file.size,
      status: 'processing',
      createdBy: createdBy,
      totalRecords: data.length - 1, // Exclude header row
      headers: headers,
      processedRecords: 0,
      failedRecords: 0,
      uploadErrors: []
    });

    await fileUpload.save();

    // Process each row in the Excel file (skip header row)
    const batchSize = 100; // Process in batches to avoid memory issues
    const totalRows = data.length - 1;
    
    console.log(`Starting to process ${totalRows} data rows (excluding header)`);
    
    for (let i = 1; i <= totalRows; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchPromises = [];
      const batchErrors = [];
      
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}, rows ${i} to ${Math.min(i + batchSize - 1, totalRows)}`);
      
      for (let j = 0; j < batch.length; j++) {
        const rowData = batch[j];
        const rowNumber = i + j;
        const row = {};
        
        // Convert row array to object using headers
        headers.forEach((header, index) => {
          if (rowData && rowData[index] !== undefined && rowData[index] !== null) {
            // Clean and convert the data
            let value = rowData[index];
            if (typeof value === 'string') {
              value = value.trim();
            }
            if (value !== '') {
              row[header] = value;
            }
          }
        });

        // Skip completely empty rows
        if (Object.keys(row).length === 0) {
          console.log(`Skipping empty row ${rowNumber + 1}`);
          continue;
        }

        // Log first few rows for debugging
        if (rowNumber <= 3) {
          console.log(`Row ${rowNumber + 1} data:`, {
            rawRowData: rowData,
            convertedRow: row,
            headers: headers
          });
        }

        try {
          const processedData = processExcelRow(row, headers, createdBy);
          
          // Ensure required fields are present
          if (!processedData.createdBy) {
            throw new Error('Missing createdBy field');
          }
          
          // Log first processed row
          if (rowNumber === 1) {
            console.log('First processed data:', JSON.stringify(processedData, null, 2));
          }
          
          // Create new document with dynamic data
          const document = new Student({
            ...processedData,
            uploadId: fileUpload._id,
            rowNumber: rowNumber + 1 // Excel row number (1-based)
          });
          
          // Add detailed debug for first row
          if (rowNumber === 1) {
            console.log('First document to save:', JSON.stringify(document.toObject(), null, 2));
          }
          
          // Validate the document before saving
          const validationError = document.validateSync();
          if (validationError) {
            console.error(`Validation error for row ${rowNumber + 1}:`, validationError.errors);
            throw new Error(`Validation failed: ${Object.keys(validationError.errors).join(', ')}`);
          }
          
          batchPromises.push(document.save());
        } catch (error) {
          console.error(`Error processing row ${rowNumber + 1}:`, error.message);
          if (rowNumber <= 5) {
            console.error(`Row data for debugging:`, row);
          }
          batchErrors.push({
            row: rowNumber + 1,
            error: error.message,
            data: row
          });
        }
      }

      // Wait for all documents in batch to save
      try {
        const results = await Promise.allSettled(batchPromises);
        let successCount = 0;
        let failureCount = 0;
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++;
          } else {
            failureCount++;
            console.error(`Batch save error for row ${i + index + 1}:`, result.reason?.message || result.reason);
            batchErrors.push({
              row: i + index + 1,
              error: `Save failed: ${result.reason?.message || 'Unknown error'}`,
              data: batch[index] || {}
            });
          }
        });
        
        fileUpload.processedRecords += successCount;
        fileUpload.failedRecords += failureCount + (batchErrors.filter(e => !e.error.startsWith('Save failed:')).length);
        fileUpload.uploadErrors.push(...batchErrors);
        await fileUpload.save();
        
        console.log(`Batch ${Math.floor(i/batchSize) + 1} completed: ${successCount} successful, ${failureCount} failed, ${batchErrors.length} total errors`);
      } catch (batchError) {
        console.error('Error in batch processing:', batchError);
        fileUpload.failedRecords += batch.length;
        fileUpload.uploadErrors.push({
          row: i + 1,
          error: 'Batch processing error: ' + batchError.message,
          data: {}
        });
        await fileUpload.save();
      }
    }

    // Update file upload status
    fileUpload.status = fileUpload.failedRecords === 0 ? 'completed' : 'completed_with_errors';
    fileUpload.completedAt = new Date();
    await fileUpload.save();

    // Prepare response
    const response = {
      success: true,
      message: `File processed successfully. ${fileUpload.processedRecords} records processed, ${fileUpload.failedRecords} failed.`,
      uploadId: fileUpload._id,
      stats: {
        total: fileUpload.totalRecords,
        successful: fileUpload.processedRecords,
        failed: fileUpload.failedRecords
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error processing file upload:', error);
    
    // Update file upload status if it was created
    if (fileUpload) {
      fileUpload.status = 'failed';
      fileUpload.uploadErrors.push({
        row: 0,
        error: error.message,
        data: {}
      });
      fileUpload.completedAt = new Date();
      await fileUpload.save();
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error processing file: ' + error.message,
      uploadId: fileUpload?._id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/upload/template - Download Excel template
router.get('/template', (req, res) => {
  try {
    // Create sample data for template
    const templateData = [
      {
        'Student ID': 'STU001',
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@example.com',
        'Phone': '+1234567890',
        'Date of Birth': '1999-05-15',
        'Program': 'Computer Science',
        'Year': 2,
        'Semester': 'Fall',
        'GPA': 3.75,
        'Credits': 60,
        'Status': 'Active'
      },
      {
        'Student ID': 'STU002',
        'First Name': 'Jane',
        'Last Name': 'Smith',
        'Email': 'jane.smith@example.com',
        'Phone': '+1234567891',
        'Date of Birth': '2000-03-22',
        'Program': 'Business Administration',
        'Year': 1,
        'Semester': 'Spring',
        'GPA': 3.90,
        'Credits': 30,
        'Status': 'Active'
      }
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=student_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);

  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ 
      message: 'Error generating template', 
      error: error.message 
    });
  }
});

// POST /api/upload/validate - Validate Excel file without saving
router.post('/validate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or has no valid data' });
    }

    const validation = {
      total: jsonData.length,
      valid: 0,
      invalid: 0,
      errors: [],
      duplicates: [],
      preview: jsonData.slice(0, 5) // Show first 5 rows as preview
    };

    // Check each row for validation
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const headers = Object.keys(row);
      const studentData = processExcelRow(row, headers, 'validation');

      // Check required fields (at least some data should exist)
      if (!row || Object.keys(row).length === 0) {
        validation.invalid++;
        validation.errors.push({
          row: i + 2,
          error: 'Empty row or no data',
          data: row
        });
        continue;
      }

      // Check for duplicates in database
      const existingStudent = await Student.findOne({
        $or: [
          { studentId: studentData.studentId },
          { email: studentData.email }
        ]
      });

      if (existingStudent) {
        validation.duplicates.push({
          row: i + 2,
          studentId: studentData.studentId,
          email: studentData.email
        });
      }

      validation.valid++;
    }

    res.json({
      message: 'File validation complete',
      validation
    });

  } catch (error) {
    console.error('Error validating file:', error);
    res.status(500).json({ 
      message: 'Error validating file', 
      error: error.message 
    });
  }
});

// DELETE /api/upload/files/:fileId - Delete a file and all its associated data
router.delete('/files/:fileId', requireAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Verify the file exists and belongs to the user
    const file = await FileUpload.findOne({ 
      _id: fileId, 
      createdBy: userId 
    });
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found or you do not have permission to delete it' 
      });
    }

    // Delete all students associated with this file
    const deleteResult = await Student.deleteMany({ uploadId: fileId });
    
    // Delete the file upload record
    await FileUpload.findByIdAndDelete(fileId);

    res.json({
      success: true,
      message: `File "${file.filename}" and ${deleteResult.deletedCount} associated records deleted successfully`,
      deletedRecords: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete file',
      error: error.message 
    });
  }
});

export default router;
