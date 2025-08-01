import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Student from '../models/Student.js';

const router = express.Router();

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

// Helper function to map Excel columns to student fields
const mapExcelToStudent = (row, createdBy) => {
  return {
    studentId: row['Student ID'] || row['ID'] || row['student_id'],
    firstName: row['First Name'] || row['FirstName'] || row['first_name'],
    lastName: row['Last Name'] || row['LastName'] || row['last_name'],
    email: row['Email'] || row['email'],
    phone: row['Phone'] || row['phone'],
    dateOfBirth: row['Date of Birth'] || row['DOB'] || row['date_of_birth'],
    program: row['Program'] || row['program'],
    year: parseInt(row['Year'] || row['year']) || 1,
    semester: row['Semester'] || row['semester'] || 'Fall',
    gpa: parseFloat(row['GPA'] || row['gpa']) || undefined,
    credits: parseInt(row['Credits'] || row['credits']) || 0,
    status: row['Status'] || row['status'] || 'Active',
    createdBy: createdBy
  };
};

// POST /api/upload/excel - Upload and process Excel file
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { createdBy } = req.body;
    if (!createdBy) {
      return res.status(400).json({ message: 'createdBy field is required' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or has no valid data' });
    }

    const results = {
      total: jsonData.length,
      successful: 0,
      failed: 0,
      errors: [],
      duplicates: []
    };

    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      try {
        const row = jsonData[i];
        const studentData = mapExcelToStudent(row, createdBy);

        // Validate required fields
        if (!studentData.studentId || !studentData.firstName || !studentData.lastName || 
            !studentData.email || !studentData.program) {
          results.failed++;
          results.errors.push({
            row: i + 2, // Excel row number (accounting for header)
            error: 'Missing required fields (Student ID, First Name, Last Name, Email, Program)',
            data: row
          });
          continue;
        }

        // Check for duplicates
        const existingStudent = await Student.findOne({
          $or: [
            { studentId: studentData.studentId },
            { email: studentData.email }
          ]
        });

        if (existingStudent) {
          results.duplicates.push({
            row: i + 2,
            studentId: studentData.studentId,
            email: studentData.email,
            message: 'Student ID or Email already exists'
          });
          continue;
        }

        // Create student
        const student = new Student(studentData);
        await student.save();
        results.successful++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          error: error.message,
          data: jsonData[i]
        });
      }
    }

    res.json({
      message: 'Excel file processed',
      results
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ 
      message: 'Error processing Excel file', 
      error: error.message 
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
      const studentData = mapExcelToStudent(row, 'validation');

      // Check required fields
      if (!studentData.studentId || !studentData.firstName || !studentData.lastName || 
          !studentData.email || !studentData.program) {
        validation.invalid++;
        validation.errors.push({
          row: i + 2,
          error: 'Missing required fields',
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

export default router;
