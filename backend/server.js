import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import storeRoutes from './routes/store.routes.js';
import productRoutes from './routes/product.routes.js';
import adRoutes from './routes/ad.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - allow frontend origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://new-amber-iota.vercel.app',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/classifieds', adRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'منصتي API is running ✅' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
