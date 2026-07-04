import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Tag, Edit, Trash2, ExternalLink, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const MyAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const { token } = useAuth();

    const fetchMyAds = async () => {
        try {
            const res = await fetch(`${API_URL}/api/classifieds/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAds(data);
        } catch (error) {
            console.error('Error fetching my ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAds();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

        setDeleting(id);
        try {
            const res = await fetch(`${API_URL}/api/classifieds/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setAds(ads.filter(ad => ad._id !== id));
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>إعلاناتي</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>إدارة ونشر إعلاناتك المبوبة على المنصة</p>
                </div>
                <Link to="/dashboard/ads/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    نشر إعلان جديد
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}><div className="spinner"></div></div>
            ) : ads.length > 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>الإعلان</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>التصنيف</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>السعر</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>التاريخ</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map((ad) => (
                                <tr key={ad._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                                                {ad.images?.[0] ? (
                                                    <img src={ad.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                        <Tag size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1e293b' }}>{ad.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <MapPin size={12} /> {ad.location}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '0.2rem 0.75rem', borderRadius: '20px' }}>{ad.category}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                        {ad.price > 0 ? `${ad.price} ر.س` : 'مجاني'}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={14} />
                                            {new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/ads/${ad._id}`} target="_blank" className="btn btn-outline" style={{ padding: '0.4rem', minWidth: 'auto', border: 'none' }} title="عرض">
                                                <ExternalLink size={18} />
                                            </Link>
                                            <Link to={`/dashboard/ads/edit/${ad._id}`} className="btn btn-outline" style={{ padding: '0.4rem', minWidth: 'auto', border: 'none', color: '#0ea5e9' }} title="تعديل">
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                disabled={deleting === ad._id}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', minWidth: 'auto', border: 'none', color: '#ef4444' }}
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '10rem 2rem', background: 'white', borderRadius: '24px' }}>
                    <Tag size={64} style={{ color: '#cbd5e1', marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem' }}>لم تقم بنشر أي إعلانات بعد</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>ابدأ الآن وقم ببيع أغراضك المستعملة أو أعلن عن خدماتك</p>
                    <Link to="/dashboard/ads/new" className="btn btn-primary">انشر أول إعلان لك</Link>
                </div>
            )}
        </div>
    );
};

export default MyAds;
