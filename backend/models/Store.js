import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    image: { type: String }, // Store logo
    bannerImage: { type: String }, // Store banner image (top of store page)
    address: { type: String }, // Physical or digital address
    governorate: {
        type: String,
        required: [true, 'Please select a governorate'],
        enum: ['دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس', 'إدلب', 'الحسكة', 'دير الزور', 'الرقة', 'درعا', 'السويداء', 'القنيطرة', 'General'],
        default: 'دمشق'
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['إلكترونيات', 'أزياء', 'أدوات منزلية', 'مطاعم', 'خدمات', 'عقارات', 'سيارات', 'وظائف', 'صحة وجمال', 'رياضة ولياقة', 'ألعاب وهوايات', 'حيوانات أليفة', 'كتب وتعليم', 'معدات وأدوات', 'أثاث ومفروشات', 'سياحة وسفر', 'أخرى', 'General'],
        default: 'أخرى'
    },
    phoneNumber: { type: String }, // Store owner phone number
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Store', storeSchema);
