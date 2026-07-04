import express from 'express';
import Product from '../models/Product.js';
import { protect, merchantOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { keyword, storeId, governorate, category } = req.query;
        const query = {};

        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category && category !== 'الكل') {
            query.category = category;
        }

        if (storeId) {
            query.store = storeId;
        }

        if (governorate && governorate !== 'الكل') {
            // Find stores in this governorate
            const Store = (await import('../models/Store.js')).default;
            const storesInGovernorate = await Store.find({ governorate }).select('_id');
            const storeIds = storesInGovernorate.map(s => s._id);
            query.store = { $in: storeIds };
        }

        const products = await Product.find(query)
            .populate('store', 'name governorate')
            .select({ images: { $slice: 1 }, name: 1, price: 1, description: 1, category: 1, stock: 1, store: 1 })
            .lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/my
// @desc    Get logged in user's store products
// @access  Private/Merchant
router.get('/my', protect, merchantOnly, async (req, res) => {
    try {
        if (!req.user.storeId) {
            return res.status(404).json({ message: 'No store found for this user' });
        }
        const products = await Product.find({ store: req.user.storeId })
            .lean();

        // Optimize payload: only first image
        const optimizedProducts = products.map(p => ({
            ...p,
            images: p.images && p.images.length > 0 ? [p.images[0]] : []
        }));

        res.json(optimizedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Merchant
router.post('/', protect, merchantOnly, async (req, res) => {
    const { name, price, description, category, stock, image } = req.body;
    console.log('--- DEBUG: Create Product ---');
    console.log('User ID:', req.user._id);
    console.log('User Role:', req.user.role);
    console.log('Store ID:', req.user.storeId);
    console.log('Body:', req.body);

    try {
        if (!req.user.storeId) {
            return res.status(400).json({ message: 'No store associated with this user. Please log out and log back in, or contact support if the issue persists.' });
        }

        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            images: image ? [image] : [],
            store: req.user.storeId,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Merchant
router.put('/:id', protect, merchantOnly, async (req, res) => {
    const { name, price, description, category, stock, image } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.store?.toString() !== req.user.storeId?.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (image) {
                // If new image provided, replace. If you want to append, push.
                // Assuming replace (single image UI)
                product.images = [image];
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Merchant
router.delete('/:id', protect, merchantOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.store?.toString() !== req.user.storeId?.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
