import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './models/Store.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const stores = await Store.find({});
        console.log('Stores found:', stores.length);
        stores.forEach(s => {
            console.log(`- Name: ${s.name}, Address: "${s.address}", Phone: "${s.phoneNumber}", Image: ${s.image ? 'Yes' : 'No'}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
