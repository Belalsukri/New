import express from 'express';
import ClassifiedAd from '../models/ClassifiedAd.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all ads
// @route   GET /api/ads
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, type, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const ads = await ClassifiedAd.find(query)
            .sort({ _id: -1 })
            .populate('user', 'name')
            .lean();

        // Optimize payload: only send the first image for listing
        const optimizedAds = ads.map(ad => ({
            ...ad,
            images: ad.images && ad.images.length > 0 ? [ad.images[0]] : []
        }));

        res.json(optimizedAds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's ads
// @route   GET /api/ads/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const ads = await ClassifiedAd.find({ user: req.user._id }).sort({ _id: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const ad = await ClassifiedAd.findById(req.params.id).populate('user', 'name');
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        req.body.user = req.user._id;
        const ad = await ClassifiedAd.create(req.body);
        res.status(201).json(ad);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let ad = await ClassifiedAd.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Make sure user owns the ad
        if (ad.user?.toString() !== req.user._id?.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this ad' });
        }

        ad = await ClassifiedAd.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(ad);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const ad = await ClassifiedAd.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Make sure user owns the ad
        if (ad.user?.toString() !== req.user._id?.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this ad' });
        }

        await ad.deleteOne();
        res.json({ message: 'Ad removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
