import mongoose from 'mongoose';

const classifiedAdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['الكترونيات', 'أثاث', 'وظائف', 'خدمات', 'سيارات', 'أخرى']
    },
    type: {
        type: String,
        required: true,
        enum: ['بيع', 'شراء', 'وظيفة', 'معلومة'],
        default: 'بيع'
    },
    images: {
        type: [String], // Array of base64 strings
        default: []
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number for WhatsApp']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ClassifiedAd = mongoose.model('ClassifiedAd', classifiedAdSchema);
export default ClassifiedAd;
