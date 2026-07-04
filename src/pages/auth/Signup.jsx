import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Store, MapPin, Upload, X, ArrowLeft, Phone } from 'lucide-react';
import styles from './Auth.module.css';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, GOVERNORATES } from '../../constants/locations';

const Signup = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [role, setRole] = useState('merchant'); // merchant or customer
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        storeName: '',
        storeAddress: '',
        storeImage: '',
        storeCategory: '',
        storeGovernorate: '',
        storePhone: ''
    });

    const { register, loading } = useAuth();
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, storeImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        setFormData({ ...formData, storeImage: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const userData = { ...formData, role };
        const result = await register(userData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'فشل إنشاء الحساب');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard} style={{ maxWidth: role === 'merchant' ? '600px' : '450px' }}>
                <div className={styles.authHeader} style={{ position: 'relative' }}>
                    <Link
                        to="/"
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none'
                        }}
                    >
                        الرئيسية <ArrowLeft size={16} />
                    </Link>
                    <h1>إنشاء حساب جديد</h1>
                    <p>انضم إلينا وابدأ تجارتك الإلكترونية</p>
                </div>
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>

                    {/* Role Selection */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            type="button"
                            className={`btn ${role === 'merchant' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1 }}
                            onClick={() => setRole('merchant')}
                        >
                            <Store size={18} style={{ marginLeft: '0.5rem' }} /> تاجر
                        </button>
                        <button
                            type="button"
                            className={`btn ${role === 'customer' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1 }}
                            onClick={() => setRole('customer')}
                        >
                            <User size={18} style={{ marginLeft: '0.5rem' }} /> زبون
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>الاسم الكامل</label>
                        <div className={styles.inputWrapper}>
                            <User size={20} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="الاسم الثلاثي"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {role === 'merchant' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label>اسم المتجر</label>
                                <div className={styles.inputWrapper}>
                                    <Store size={20} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        placeholder="اسم متجرك المميز"
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>رقم هاتف المتجر</label>
                                <div className={styles.inputWrapper}>
                                    <Phone size={20} className={styles.inputIcon} />
                                    <input
                                        type="tel"
                                        placeholder="مثال: 05xxxxxxx"
                                        value={formData.storePhone}
                                        onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>تصنيف المتجر</label>
                                <div className={styles.inputWrapper}>
                                    <Store size={20} className={styles.inputIcon} />
                                    <select
                                        value={formData.storeCategory}
                                        onChange={(e) => setFormData({ ...formData, storeCategory: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2.5rem 1rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-main)',
                                            fontSize: '1rem',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            appearance: 'none'
                                        }}
                                    >
                                        <option value="" disabled>اختر تصنيف المتجر</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>المحافظة</label>
                                <div className={styles.inputWrapper}>
                                    <MapPin size={20} className={styles.inputIcon} />
                                    <select
                                        value={formData.storeGovernorate}
                                        onChange={(e) => setFormData({ ...formData, storeGovernorate: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2.5rem 1rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-main)',
                                            fontSize: '1rem',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            appearance: 'none'
                                        }}
                                    >
                                        <option value="" disabled>اختر المحافظة</option>
                                        {GOVERNORATES.filter(g => g !== 'الكل').map(gov => (
                                            <option key={gov} value={gov}>{gov}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>عنوان المتجر (تفاصيل)</label>
                                <div className={styles.inputWrapper}>
                                    <MapPin size={20} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        placeholder="الشارع، المبنى..."
                                        value={formData.storeAddress}
                                        onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>صورة المتجر (شعار)</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />

                                {!imagePreview ? (
                                    <div
                                        onClick={triggerFileInput}
                                        style={{
                                            border: '2px dashed var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            background: 'var(--bg-main)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Upload size={24} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>رفع شعار المتجر</p>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Store Preview"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-color)'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className={styles.inputGroup}>
                        <label>البريد الإلكتروني</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={20} className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>كلمة المرور</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="8 أحرف كحد أدنى، وحرف كبير وصغير ورقم"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={8}
                                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                                title="يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير، حرف صغير، ورقم."
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                        {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>لديك حساب بالفعل؟ <Link to="/login">سجل الدخول</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
