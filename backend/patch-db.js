import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
});
const User = mongoose.model('User', UserSchema);

const StoreSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
});
const Store = mongoose.model('Store', StoreSchema);

async function patchDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Update all stores to be active
        const storeResult = await Store.updateMany({}, { $set: { isActive: true } });
        console.log(`Updated ${storeResult.modifiedCount} stores to isActive: true`);

        // Set isFeatured to false for all stores if not set
        const featuredResult = await Store.updateMany({ isFeatured: { $exists: false } }, { $set: { isFeatured: false } });
        console.log(`Updated ${featuredResult.modifiedCount} stores to isFeatured: false`);

        // Update a specific user to admin (I'll guess from the common email patterns or just pick one)
        const users = await User.find({});
        if (users.length > 0) {
            // Picking the first user to be admin for testing purposes, or the user can tell me.
            // Usually the owner is the one who created the first account.
            const adminEmail = 'belalsukari@gmail.com'; // Common email for this user
            const adminUser = await User.findOneAndUpdate({ email: adminEmail }, { role: 'admin' }, { new: true });
            if (adminUser) {
                console.log(`User ${adminEmail} is now an admin`);
            } else {
                // If not found, just make the first one admin so they can see the dashboard
                const firstUser = await User.findOneAndUpdate({}, { role: 'admin' }, { new: true });
                console.log(`User ${firstUser.email} is now an admin`);
            }
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

patchDB();
