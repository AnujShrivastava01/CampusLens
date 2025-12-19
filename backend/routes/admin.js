import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import FileUpload from '../models/FileUpload.js';
import Student from '../models/Student.js';
import multer from 'multer';
import XLSX from 'xlsx';

const router = express.Router();

// Middleware to verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_keep_it_safe');

            req.admin = await Admin.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret_keep_it_safe', {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create initial admin (Run once or use seed script)
// @route   POST /api/admin/create-initial
// @access  Public (Should be disabled in production or protected)
router.post('/create-initial', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await Admin.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = await Admin.create({
            username,
            password
        });
        res.status(201).json({
            _id: admin._id,
            username: admin.username,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Reuse upload logic components
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.originalname.endsWith('.xlsx')) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'), false);
        }
    }
});

const processExcelRow = (row, headers, createdBy) => {
    const data = {
        _rawData: {},
        createdBy: createdBy, // Admin ID
        createdAt: new Date()
    };

    headers.forEach(header => {
        if (row[header] !== undefined && row[header] !== null) {
            data._rawData[header] = row[header];
        }
    });

    const possibleIdFields = ['ID', 'id', 'Student ID', 'StudentID', 'student_id', 'Roll No', 'Roll Number'];
    let rowId = null;
    for (const field of possibleIdFields) {
        if (data._rawData[field]) {
            rowId = data._rawData[field];
            break;
        }
    }

    if (!rowId) {
        const firstValue = Object.values(data._rawData)[0];
        rowId = firstValue ? `ROW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : `EMPTY_${Date.now()}`;
    }
    data.studentId = rowId;
    return data;
};

// @desc    Upload file as Admin
// @route   POST /api/admin/upload
// @access  Private/Admin
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (data.length <= 1) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        const headers = data[0].map(h => (h ? h.toString().trim() : '')).filter(h => h);
        if (headers.length === 0) {
            return res.status(400).json({ message: 'No valid headers found' });
        }

        const fileUpload = new FileUpload({
            filename: req.file.originalname,
            size: req.file.size,
            status: 'processing',
            createdBy: req.admin._id, // Associated with Admin
            totalRecords: data.length - 1,
            headers: headers,
            processedRecords: 0,
            failedRecords: 0,
            uploadErrors: []
        });

        await fileUpload.save();

        // Process rows (Simplified synchronous for now, knowing node allows async in loops but be careful with large files)
        // Ideally should be background job or batched similar to upload.js
        const batchSize = 100;
        const totalRows = data.length - 1;

        for (let i = 1; i <= totalRows; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const batchPromises = [];

            for (let j = 0; j < batch.length; j++) {
                const rowData = batch[j];
                const row = {};
                headers.forEach((header, index) => {
                    if (rowData && rowData[index] !== undefined) {
                        row[header] = rowData[index];
                    }
                });

                if (Object.keys(row).length === 0) continue;

                try {
                    const processedData = processExcelRow(row, headers, req.admin._id);
                    const document = new Student({
                        ...processedData,
                        uploadId: fileUpload._id,
                        rowNumber: i + j + 1
                    });
                    batchPromises.push(document.save());
                } catch (err) {
                    console.error('Row error', err);
                    fileUpload.failedRecords++;
                }
            }

            const results = await Promise.allSettled(batchPromises);
            // Count success
            const success = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            fileUpload.processedRecords += success;
            fileUpload.failedRecords += failed;
            await fileUpload.save();
        }

        fileUpload.status = fileUpload.failedRecords === 0 ? 'completed' : 'completed_with_errors';
        fileUpload.completedAt = new Date();
        await fileUpload.save();

        res.json({
            success: true,
            message: 'File processed',
            uploadId: fileUpload._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed: ' + error.message });
    }
});

// @desc    Get all files (or admin's files)
// @route   GET /api/admin/files
// @access  Private/Admin
router.get('/files', protect, async (req, res) => {
    try {
        // Decide if admin sees ALL files or just theirs. Usually admin sees all.
        // If checking only their own: { createdBy: req.admin._id }
        // User asked "where i can uplaod and delete files", likely implies managing the content.
        // Let's show files created by this admin for now to avoid clutter if there are many users,
        // or add a query param to toggle.
        // User said "admin route... where i can upload and delete files".
        // I'll default to only showing files uploaded by this admin user to keep it clean, 
        // assuming "Admin" is a special user but interacts with the same data structures.

        const files = await FileUpload.find({ createdBy: req.admin._id })
            .sort({ createdAt: -1 });
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete file
// @route   DELETE /api/admin/files/:id
// @access  Private/Admin
router.delete('/files/:id', protect, async (req, res) => {
    try {
        const file = await FileUpload.findOne({ _id: req.params.id, createdBy: req.admin._id });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await Student.deleteMany({ uploadId: file._id });
        await FileUpload.findByIdAndDelete(file._id);

        res.json({ success: true, message: 'File removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get file data (admin)
// @route   GET /api/admin/files/:fileId/data
// @access  Private/Admin
router.get('/files/:fileId/data', protect, async (req, res) => {
    try {
        const { fileId } = req.params;
        const { page = 1, limit = 50, search, filters } = req.query;

        const file = await FileUpload.findOne({
            _id: fileId,
            createdBy: req.admin._id
        });
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const query = { uploadId: fileId };

        if (search && search.trim() !== '') {
            const searchTerm = search.trim();
            const searchConditions = [
                { 'studentId': { $regex: searchTerm, $options: 'i' } }
            ];
            if (file.headers && file.headers.length > 0) {
                file.headers.forEach(header => {
                    const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    searchConditions.push({
                        [`_rawData.${escapedHeader}`]: { $regex: searchTerm, $options: 'i' }
                    });
                });
            }
            query.$or = searchConditions;
        }

        if (filters && filters.trim() !== '') {
            try {
                const filterObj = JSON.parse(filters);
                Object.entries(filterObj).forEach(([key, value]) => {
                    if (value && value !== '' && value !== 'ALL') {
                        const filterValue = String(value).trim();
                        if (filterValue.length > 0) {
                            if (file.headers && file.headers.includes(key)) {
                                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const escapedValue = filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                query[`_rawData.${escapedKey}`] = { $regex: `^${escapedValue}$`, $options: 'i' };
                            } else if (key === 'studentId') {
                                // handle studentId specifically if needed, or as generic
                                const escapedValue = filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                query[key] = { $regex: `^${escapedValue}$`, $options: 'i' };
                            }
                        }
                    }
                });
            } catch (e) {
                console.warn('Invalid filters format:', e);
            }
        }

        const total = await Student.countDocuments(query);
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
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get unique values for filters (admin)
// @route   GET /api/admin/files/:fileId/unique-values
// @access  Private/Admin
router.get('/files/:fileId/unique-values', protect, async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await FileUpload.findOne({
            _id: fileId,
            createdBy: req.admin._id
        });
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const uniqueValues = {};
        const allRecords = await Student.find({ uploadId: fileId }).lean();

        if (allRecords.length === 0) {
            return res.json({ success: true, uniqueValues: {}, totalColumns: 0 });
        }

        for (const header of file.headers) {
            try {
                const values = new Set();
                allRecords.forEach(record => {
                    let value = null;
                    if (record._rawData && record._rawData[header] !== undefined) {
                        value = record._rawData[header];
                    } else if (record[header] !== undefined) {
                        value = record[header];
                    }
                    if (value !== null && value !== undefined && value !== '') {
                        const stringValue = String(value).trim();
                        if (stringValue.length > 0) values.add(stringValue);
                    }
                });
                uniqueValues[header] = Array.from(values).slice(0, 100);
            } catch (e) {
                uniqueValues[header] = [];
            }
        }

        res.json({
            success: true,
            uniqueValues,
            totalColumns: Object.keys(uniqueValues).length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
