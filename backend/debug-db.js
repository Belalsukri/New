import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function debug() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`Collection ${col.name}: ${count} documents`);
            const docs = await mongoose.connection.db.collection(col.name).find({}).limit(5).toArray();
            console.log(`Sample from ${col.name}:`, JSON.stringify(docs, null, 2));
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

debug();
