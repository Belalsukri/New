import express from 'express';
import Store from '../models/Store.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, merchantOnly, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { governorate, category } = req.query;
        let query = { isActive: true };

        if (governorate) query.governorate = governorate;
        if (category) query.category = category;

        const stores = await Store.find(query).populate('owner', 'name email');

        const storesWithData = await Promise.all(stores.map(async (store) => {
            const lastProduct = await Product.findOne({ store: store._id })
                .sort({ createdAt: -1 })
                .select('images name price')
                .lean();

            // Optimize payload: only first image
            if (lastProduct && lastProduct.images && lastProduct.images.length > 0) {
                lastProduct.images = [lastProduct.images[0]];
            }

            return {
                ...store.toObject(),
                lastProduct
            };
        }));

        res.json(storesWithData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/stores/my
// @desc    Get current user's store
// @access  Private/Merchant
router.get('/my', protect, merchantOnly, async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });
        if (store) {
            res.json(store);
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/stores/my
// @desc    Update current user's store
// @access  Private/Merchant
router.put('/my', protect, merchantOnly, async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });

        if (store) {
            console.log('--- DEBUG: Updating Store ---');
            console.log('Store ID:', store._id);
            console.log('Incoming Body Fields:', Object.keys(req.body));
            console.log('Incoming Banner Length:', req.body.bannerImage ? req.body.bannerImage.length : 'undefined');
            console.log('Incoming Phone:', req.body.phoneNumber);

            // Update only if value is provided (not undefined)
            if (req.body.name !== undefined) store.name = req.body.name;
            if (req.body.description !== undefined) store.description = req.body.description;
            if (req.body.address !== undefined) store.address = req.body.address;
            if (req.body.image !== undefined) store.image = req.body.image;
            if (req.body.bannerImage !== undefined) store.bannerImage = req.body.bannerImage;
            if (req.body.phoneNumber !== undefined) store.phoneNumber = req.body.phoneNumber;

            const updatedStore = await store.save();
            res.json(updatedStore);
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/stores/my
// @desc    Delete current user's store
// @access  Private/Merchant
router.delete('/my', protect, merchantOnly, async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });

        if (store) {
            await Store.deleteOne({ _id: store._id });

            // Optionally clear storeId from user
            const user = await User.findById(req.user._id);
            user.storeId = undefined;
            await user.save();

            res.json({ message: 'Store removed' });
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Public
router.get('/:id', async (req, res) => {
    console.time(`GetStore-${req.params.id}`);
    try {
        const store = await Store.findById(req.params.id).populate('owner', 'name email');
        console.timeEnd(`GetStore-${req.params.id}`);

        if (store) {
            // Check payload size roughly
            const size = JSON.stringify(store).length;
            console.log(`Payload size for store ${store.name}: ${size} bytes`);
            res.json(store);
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

// Admin Routes

// @route   GET /api/stores/admin/all
// @desc    Get all stores for admin
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const stores = await Store.find({}).populate('owner', 'name email');
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/stores/admin
// @desc    Create a store manually (and optionally the user)
// @access  Private/Admin
router.post('/admin', protect, adminOnly, async (req, res) => {
    const { name, ownerEmail, ownerName, ownerPassword, description, address, image, bannerImage, phoneNumber } = req.body;
    try {
        let owner = await User.findOne({ email: ownerEmail });
        
        if (!owner) {
            // User does not exist, we need to create them
            if (!ownerName || !ownerPassword) {
                return res.status(400).json({ message: 'المستخدم غير موجود. يرجى إدخال اسم المالك وكلمة المرور لإنشاء حساب جديد له.' });
            }

            // Validate password strength
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regex.test(ownerPassword)) {
                return res.status(400).json({ message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير، حرف صغير، ورقم.' });
            }

            owner = await User.create({
                name: ownerName,
                email: ownerEmail,
                password: ownerPassword,
                role: 'merchant'
            });
        } else {
            // If user exists, ensure they are a merchant
            if (owner.role !== 'merchant') {
                owner.role = 'merchant';
                await owner.save();
            }
        }

        const store = new Store({
            name,
            owner: owner._id,
            description,
            address,
            image,
            bannerImage,
            phoneNumber,
            isActive: true
        });

        const createdStore = await store.save();

        owner.storeId = createdStore._id;
        await owner.save();

        res.status(201).json(createdStore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/stores/admin/:id
// @desc    Delete store by id
// @access  Private/Admin
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
    console.log(`Attempting to delete store ID: ${req.params.id}`);
    try {
        const store = await Store.findById(req.params.id);
        if (store) {
            console.log(`Found store: ${store.name}, deleting...`);
            await Store.deleteOne({ _id: store._id });

            const user = await User.findById(store.owner);
            if (user) {
                user.storeId = undefined;
                await user.save();
            }

            res.json({ message: 'Store removed' });
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/stores/admin/toggle-featured/:id
// @desc    Toggle store featured status
// @access  Private/Admin
router.put('/admin/toggle-featured/:id', protect, adminOnly, async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (store) {
            store.isFeatured = !store.isFeatured;
            await store.save();
            res.json(store);
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @route   POST /api/stores/my/recreate
// @desc    Recreate store if missing (Fix for broken accounts)
// @access  Private/Merchant
router.post('/my/recreate', protect, merchantOnly, async (req, res) => {
    try {
        let store = await Store.findOne({ owner: req.user._id });

        if (store) {
            return res.status(400).json({ message: 'لديك متجر بالفعل', store });
        }

        store = await Store.create({
            name: `${req.user.name}'s Store`,
            owner: req.user._id,
            description: 'تم إنشاء المتجر تلقائياً',
            address: 'يرجى تحديث العنوان',
            isActive: true
        });

        // Update user
        const user = await User.findById(req.user._id);
        user.storeId = store._id;
        await user.save();

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
