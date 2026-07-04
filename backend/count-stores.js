import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function count() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log('Connected.');
        const count = await mongoose.connection.db.collection('stores').countDocuments();
        console.log('Store count:', count);

        const activeCount = await mongoose.connection.db.collection('stores').countDocuments({ isActive: true });
        console.log('Active store count:', activeCount);

        const allStores = await mongoose.connection.db.collection('stores').find({}).toArray();
        console.log('All stores:', JSON.stringify(allStores, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

count();
