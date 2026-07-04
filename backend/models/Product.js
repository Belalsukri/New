import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: {
        type: String,
        required: true,
        enum: ['إلكترونيات', 'أزياء', 'أدوات منزلية', 'مطاعم', 'خدمات', 'عقارات', 'سيارات', 'وظائف', 'صحة وجمال', 'رياضة ولياقة', 'ألعاب وهوايات', 'حيوانات أليفة', 'كتب وتعليم', 'معدات وأدوات', 'أثاث ومفروشات', 'سياحة وسفر', 'أخرى', 'General']
    },
    stock: { type: Number, default: 0 },
    images: [{ type: String }], // Array of image URLs (or base64 for MVP)
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
