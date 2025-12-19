import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            console.error('Error: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in your .env file');
            process.exit(1);
        }

        const userExists = await Admin.findOne({ username });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = await Admin.create({
            username,
            password
        });

        console.log(`Admin user '${admin.username}' created successfully`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
