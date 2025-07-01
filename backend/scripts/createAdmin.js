const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');

const connectDB = require('../config/database');

const createAdminUser = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            $or: [
                { email: 'admin@ebanking.com' },
                { email: 'admin@jpmc.com' }
            ]
        });
        
        if (existingAdmin) {
            console.log('Admin user already exists, removing old admin...');
            await User.findByIdAndDelete(existingAdmin._id);
            console.log('Old admin user removed');
        }

        // Create new admin user with JPMC credentials
        const adminUser = await User.create({
            firstName: 'JPMC',
            lastName: 'Administrator',
            email: 'admin@jpmc.com',
            password: 'admin123',
            passwordConfirm: 'admin123',
            phone: '0000000000',
            dateOfBirth: '1990-01-01',
            address: {
                street: '270 Park Avenue',
                city: 'New York',
                state: 'NY',
                zipCode: '10017',
                country: 'United States'
            },
            role: 'admin',
            isActive: true,
            isEmailVerified: true
        });

        console.log('Admin user created successfully:', {
            id: adminUser._id,
            email: adminUser.email,
            role: adminUser.role
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
