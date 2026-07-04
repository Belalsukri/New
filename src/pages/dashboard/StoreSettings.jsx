import { useState, useEffect, useRef } from 'react';
import { Store, Save, Trash2, MapPin, Upload, X, Loader, Phone, Image, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../auth/Auth.module.css';
import { GOVERNORATES, CATEGORIES } from '../../constants/locations';
import API_URL from '../../config';

const StoreSettings = () => {
    const { token, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        image: '',
        bannerImage: '',
        phoneNumber: '',
        governorate: 'دمشق',
        category: 'أخرى'
    });

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stores/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        address: data.address || '',
                        image: data.image || '',
                        bannerImage: data.bannerImage || '',
                        phoneNumber: data.phoneNumber || '',
                        governorate: data.governorate || 'دمشق',
                        category: data.category || 'أخرى'
                    });
                    setImagePreview(data.image || null);
                    setBannerPreview(data.bannerImage || null);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('فشل في تحميل بيانات المتجر');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStoreData();
    }, [token]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
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
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
                setFormData(prev => ({ ...prev, bannerImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerBannerInput = () => {
        bannerInputRef.current.click();
    };

    const removeBanner = (e) => {
        e.stopPropagation();
        setBannerPreview(null);
        setFormData(prev => ({ ...prev, bannerImage: '' }));
        if (bannerInputRef.current) {
            bannerInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        console.log('Submitting store data:', formData);

        try {
            const res = await fetch(`${API_URL}/api/stores/my`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', res.status);
            const data = await res.json();
            console.log('Response data:', data);

            if (res.ok) {
                setSuccess('تم تحديث إعدادات المتجر بنجاح');
                // Update previews with saved data
                setImagePreview(data.image || null);
                setBannerPreview(data.bannerImage || null);
            } else {
                setError(data.message || 'فشل التحديث');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('خطأ في الاتصال بالخادم');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStore = async () => {
        if (!window.confirm('هل أنت متأكد من حذف المتجر؟ لا يمكن التراجع عن هذا الإجراء وسوف تفقد جميع المنتجات.')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/stores/my`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('تم حذف المتجر بنجاح. سيتم تسجيل خروجك الآن.');
                logout();
                window.location.href = '/';
            } else {
                const data = await res.json();
                setError(data.message || 'فشل حذف المتجر');
            }
        } catch (err) {
            setError('خطأ في حذف المتجر');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>جاري تحميل الإعدادات...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>إعدادات المتجر</h1>
                <button
                    onClick={handleDeleteStore}
                    className="btn btn-outline"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                    <Trash2 size={18} style={{ marginLeft: '0.5rem' }} />
                    حذف المتجر
                </button>
            </div>

            <div className="card">
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.inputGroup}>
                        <label>اسم المتجر</label>
                        <div className={styles.inputWrapper}>
                            <Store size={20} className={styles.inputIcon} />
                            <input
                                className="input"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>وصف المتجر</label>
                        <textarea
                            className="input"
                            rows="4"
                            placeholder="اكتب وصفاً مختصراً لمتجرك..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>عنوان المتجر (التفصيلي)</label>
                        <div className={styles.inputWrapper}>
                            <MapPin size={20} className={styles.inputIcon} />
                            <input
                                className="input"
                                type="text"
                                placeholder="الحي، الشارع، البناء"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className={styles.inputGroup}>
                            <label>المحافظة</label>
                            <div className={styles.inputWrapper}>
                                <MapPin size={20} className={styles.inputIcon} />
                                <select
                                    className="input"
                                    value={formData.governorate}
                                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                    style={{ appearance: 'none' }}
                                >
                                    {GOVERNORATES.filter(g => g !== 'الكل').map(gov => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>تصنيف المتجر</label>
                            <div className={styles.inputWrapper}>
                                <Tag size={20} className={styles.inputIcon} />
                                <select
                                    className="input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ appearance: 'none' }}
                                >
                                    {CATEGORIES.filter(c => c !== 'الكل').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className={styles.inputGroup}>
                        <label>شعار المتجر</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />

                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div
                                onClick={triggerFileInput}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: 'var(--bg-main)',
                                    transition: 'all 0.2s',
                                    overflow: 'hidden'
                                }}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <Upload size={24} color="var(--text-muted)" />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>تغيير الشعار</span>
                                    </>
                                )}
                            </div>
                            {imagePreview && (
                                <button type="button" onClick={removeImage} className="btn btn-outline" style={{ color: 'var(--danger)' }}>
                                    <X size={16} style={{ marginLeft: '0.5rem' }} /> إزالة الشعار
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>صورة البانر (صورة كبيرة بالأعلى)</label>
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={handleBannerUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div
                                onClick={triggerBannerInput}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: 'var(--bg-main)',
                                    transition: 'all 0.2s',
                                    overflow: 'hidden'
                                }}
                            >
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <Image size={32} color="var(--text-muted)" />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>انقر لتحميل صورة البانر</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>الحجم الموصى به: 1200x400 بكسل</span>
                                    </>
                                )}
                            </div>
                            {bannerPreview && (
                                <button type="button" onClick={removeBanner} className="btn btn-outline" style={{ color: 'var(--danger)', alignSelf: 'flex-start' }}>
                                    <X size={16} style={{ marginLeft: '0.5rem' }} /> إزالة البانر
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>رقم الهاتف</label>
                        <div className={styles.inputWrapper}>
                            <Phone size={20} className={styles.inputIcon} />
                            <input
                                className="input"
                                type="tel"
                                placeholder="05xxxxxxxx"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader size={18} className="spin" style={{ marginLeft: '0.5rem' }} /> جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save size={18} style={{ marginLeft: '0.5rem' }} /> حفظ التغييرات
                                </>
                            )}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default StoreSettings;
