import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        const u = await User.findOne({ email: 'belalsukari@gmail.com' });
        console.log('User Found:', u ? u.email : 'No');
        console.log('Role:', u ? u.role : 'NA');
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
