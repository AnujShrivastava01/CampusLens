import express from 'express';
import Student from '../models/Student.js';
import Joi from 'joi';

const router = express.Router();

// Validation schema
const studentValidationSchema = Joi.object({
  studentId: Joi.string().required().trim(),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  program: Joi.string().required().trim(),
  year: Joi.number().integer().min(1).max(6).required(),
  semester: Joi.string().valid('Fall', 'Spring', 'Summer').required(),
  gpa: Joi.number().min(0).max(4.0).optional(),
  credits: Joi.number().min(0).optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    relationship: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional()
  }).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Graduated', 'Suspended', 'Withdrawn').optional(),
  courses: Joi.array().items(Joi.object({
    courseId: Joi.string().optional(),
    courseName: Joi.string().optional(),
    grade: Joi.string().optional(),
    credits: Joi.number().optional(),
    semester: Joi.string().optional(),
    year: Joi.number().optional()
  })).optional(),
  customFields: Joi.object().optional(),
  createdBy: Joi.string().required()
});

// GET /api/students - Get all students with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      program,
      year,
      semester,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (program) filter.program = program;
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = semester;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const students = await Student.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Student.countDocuments(filter);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// GET /api/students/:id - Get single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// POST /api/students - Create new student
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = studentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ studentId: value.studentId });
    if (existingStudent) {
      return res.status(409).json({ message: 'Student ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email: value.email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const student = new Student(value);
    await student.save();
    
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', async (req, res) => {
  try {
    // Validate request body (make createdBy optional for updates)
    const updateSchema = studentValidationSchema.fork(['createdBy'], (schema) => schema.optional());
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...value, updatedBy: req.body.updatedBy },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// GET /api/students/stats/overview - Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    
    const programStats = await Student.aggregate([
      { $group: { _id: '$program', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const yearStats = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const averageGPA = await Student.aggregate([
      { $match: { gpa: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgGPA: { $avg: '$gpa' } } }
    ]);

    res.json({
      totalStudents,
      activeStudents,
      programStats,
      yearStats,
      averageGPA: averageGPA[0]?.avgGPA || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

export default router;
