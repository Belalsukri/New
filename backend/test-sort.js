import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import ClassifiedAd from './models/ClassifiedAd.js';

async function test() {
    await connectDB();
    try {
        const ads = await ClassifiedAd.find().sort({ _id: -1 }).limit(1).lean();
        console.log("Success:", ads.map(a => a.title));
    } catch (err) {
        console.error("Error:", err);
    }
    process.exit(0);
}
test();
