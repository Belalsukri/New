import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Store from '../models/Store.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role, storeName, storeDescription, storeAddress, storeImage, storePhone } = req.body;

    try {
        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير، حرف صغير، ورقم.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (role === 'merchant') {
            if (!storeName) {
                return res.status(400).json({ message: 'اسم المتجر مطلوب للحسابات التجارية' });
            }
            if (!storePhone) {
                return res.status(400).json({ message: 'رقم هاتف المتجر مطلوب للحسابات التجارية' });
            }
            const store = await Store.create({
                name: storeName,
                owner: user._id,
                description: storeDescription || '',
                address: storeAddress || '',
                image: storeImage || '',
                category: req.body.storeCategory || 'General',
                governorate: req.body.storeGovernorate || 'General',
                phoneNumber: storePhone
            });
            user.storeId = store._id;
            await user.save();
        }

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeId: user.storeId,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user info (Debug)
// @access  Private
router.get('/me', async (req, res) => {
    try {
        // Build this manually to bypass strict middleware for debugging if needed, 
        // but here we want to see what 'protect' sees.
        // We'll duplicate the protect logic briefly or just assume it's used if we add it to route

        // Actually, let's just use the token from header manually to see what's inside
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await User.findById(decoded.id);
            const store = await Store.findOne({ owner: decoded.id });

            res.json({
                user,
                store_found_in_db: store,
                decoded_token: decoded
            });
        } else {
            res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Self-repair: If merchant has no storeId, try to find one
            if (user.role === 'merchant' && !user.storeId) {
                const store = await Store.findOne({ owner: user._id });
                if (store) {
                    user.storeId = store._id;
                    await user.save();
                }
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeId: user.storeId,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'لا يوجد مستخدم بهذا البريد الإلكتروني' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // Create reset url - uses FRONTEND_URL env var or the fixed vercel URL
        const frontendUrl = process.env.FRONTEND_URL || 'https://new-amber-iota.vercel.app';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `لقد طلبت إعادة تعيين كلمة المرور.\n\nالرجاء النقر على الرابط التالي لإعادة تعيين كلمة المرور:\n\n${resetUrl}`;

        try {
            // Bypass email sending completely for testing/demo purposes to avoid hanging
            return res.status(200).json({ 
                success: true, 
                message: 'تم إنشاء رابط إعادة التعيين (تم تجاوز الإيميل للاختبار): ' + resetUrl,
                resetUrl 
            });
        } catch (err) {
            console.error('Email send failed:', err);
            
            // For testing/demo purposes when email isn't configured, return the link in the response
            res.status(200).json({ 
                success: true, 
                message: 'لم يتم إعداد خدمة البريد، ولكن هذا هو الرابط للاختبار: ' + resetUrl,
                resetUrl 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

// @route   PUT /api/auth/resetpassword/:token
// @desc    Reset password
// @access  Public
router.put('/resetpassword/:token', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'الرابط غير صالح أو منتهي الصلاحية' });
        }

        if (!isStrongPassword(req.body.password)) {
             return res.status(400).json({ message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير، حرف صغير، ورقم.' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        res.status(200).json({
            success: true,
            message: 'تم إعادة تعيين كلمة المرور بنجاح',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            storeId: user.storeId,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطأ في الخادم' });
    }
});

export default router;
