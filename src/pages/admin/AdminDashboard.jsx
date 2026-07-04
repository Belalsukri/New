import { useState, useEffect } from 'react';
import { Store, Trash2, Star, StarOff, Users, ShoppingBag, Loader, Plus, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminDashboard.module.css';
import API_URL from '../../config';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        ownerEmail: '',
        ownerName: '',
        ownerPassword: '',
        description: '',
        address: '',
        image: '',
        bannerImage: '',
        phoneNumber: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchAllStores = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/stores/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStores(data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('فشل في تحميل المتاجر');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAllStores();
    }, [token]);

    const handleToggleFeatured = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/stores/admin/toggle-featured/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setStores(stores.map(s => s._id === id ? { ...s, isFeatured: !s.isFeatured } : s));
            }
        } catch (err) {
            console.error('Failed to toggle featured status');
        }
    };

    const handleDeleteStore = async () => {
        if (!confirmDelete) return;
        const { id, name } = confirmDelete;

        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/api/stores/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setStores(prev => prev.filter(s => s._id !== id));
                setConfirmDelete(null);
                alert('تم حذف متجر ' + name + ' بنجاح');
            } else {
                const data = await res.json();
                alert(`فشل الحذف: ${data.message || 'خطأ غير معروف'}`);
            }
        } catch (err) {
            alert('حدث خطأ أثناء محاولة الحذف');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddStore = async (e) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.ownerEmail) {
            alert('يرجى ملء الاسم وبريد المالك');
            return;
        }

        try {
            setSubmitting(true);
            console.log('Sending Add Store Request:', formData);
            const res = await fetch(`${API_URL}/api/stores/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log('Add Store Response:', res.status, data);

            if (res.ok) {
                setStores(prev => [...prev, data]);
                setIsAddModalOpen(false);
                setFormData({ name: '', ownerEmail: '', ownerName: '', ownerPassword: '', description: '', address: '', image: '', bannerImage: '', phoneNumber: '' });
                alert('تم إضافة المتجر وإنشاء الحساب بنجاح');
            } else {
                alert(data.message || 'فشل إضافة المتجر.');
            }
        } catch (err) {
            console.error('Add Store Error:', err);
            alert('حدث خطأ في الاتصال بالسيرفر');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, bannerImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader size={40} className="spin" color="var(--primary)" />
        </div>
    );

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>إدارة المنصة</h1>
                    <p>التحكم في المتاجر والمحتوى المعروض</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    إضافة متجر جديد
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                        <Store size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>إجمالي المتاجر</span>
                        <h3>{stores.length}</h3>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Star size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span>متاجر مميزة</span>
                        <h3>{stores.filter(s => s.isFeatured).length}</h3>
                    </div>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>المتجر</th>
                            <th>المالك</th>
                            <th>تاريخ الإنشاء</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store) => (
                            <tr key={store._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className={styles.storeLogo}>
                                            {store.image ? (
                                                <img src={store.image} alt={store.name} />
                                            ) : (
                                                <Store size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{store.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{store.address || 'بلا عنوان'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>{store.owner?.name || 'غير معروف'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{store.owner?.email || 'لا يوجد بريد'}</div>
                                </td>
                                <td>{new Date(store.createdAt).toLocaleDateString('ar-EG')}</td>
                                <td>
                                    <span className={`${styles.badge} ${store.isFeatured ? styles.featured : ''}`}>
                                        {store.isFeatured ? 'مميز' : 'عادي'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFeatured(store._id)}
                                            className={styles.actionBtn}
                                            title={store.isFeatured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
                                        >
                                            {store.isFeatured ? <StarOff size={18} color="#d97706" style={{ pointerEvents: 'none' }} /> : <Star size={18} color="#d97706" style={{ pointerEvents: 'none' }} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDelete({ id: store._id, name: store.name })}
                                            className={styles.actionBtn}
                                            style={{ color: 'var(--danger)' }}
                                            title="حذف المتجر"
                                        >
                                            <Trash2 size={18} style={{ pointerEvents: 'none' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {stores.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        لا يوجد متاجر حالياً
                    </div>
                )}
            </div>

            {/* Add Store Modal */}
            {isAddModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>إضافة متجر جديد</h2>
                            <button type="button" className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddStore} className={styles.form}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>اسم المتجر</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="مثال: متجر السعادة"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>بريد المالك الإلكتروني</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={formData.ownerEmail}
                                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                    required
                                    placeholder="سيتم إنشاء حساب له إن لم يكن مسجلاً"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>اسم المالك (في حال إنشاء حساب جديد)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    placeholder="مثال: أحمد محمد"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>كلمة المرور (في حال إنشاء حساب جديد)</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.ownerPassword}
                                    onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                                    placeholder="8 أحرف كحد أدنى، وحرف كبير وصغير ورقم"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>وصف المتجر</label>
                                <textarea
                                    className="input"
                                    style={{ height: '80px', resize: 'none' }}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="وصف قصير عن المتجر وما يقدمه"
                                ></textarea>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>العنوان</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="المدينة، الحي أو رابط"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>رقم الهاتف</label>
                                <input
                                    type="tel"
                                    className="input"
                                    value={formData.phoneNumber || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    placeholder="05xxxxxxxx"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>شعار المتجر</label>
                                <input
                                    type="file"
                                    className="input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {formData.image && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>صورة البانر</label>
                                <input
                                    type="file"
                                    className="input"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                />
                                {formData.bannerImage && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img src={formData.bannerImage} alt="Preview" style={{ width: '100%', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                                    {submitting ? 'جاري الإضافة...' : 'إضافة المتجر'}
                                </button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {confirmDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
                            <AlertTriangle size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>تأكيد الحذف</h2>
                        <p style={{ marginBottom: '2rem' }}>
                            هل أنت متأكد من حذف متجر <strong>"{confirmDelete.name}"</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn"
                                style={{ flex: 1, backgroundColor: 'var(--danger)', color: 'white' }}
                                onClick={handleDeleteStore}
                                disabled={submitting}
                            >
                                {submitting ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setConfirmDelete(null)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
