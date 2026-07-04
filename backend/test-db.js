import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const StoreSchema = new mongoose.Schema({
    name: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: String,
});

const Store = mongoose.model('Store', StoreSchema);

async function checkStores() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log('Connected!');
        const stores = await Store.find({}).populate('owner', 'name email');
        console.log('Found stores:', stores.length);
        console.log(JSON.stringify(stores, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkStores();
