import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, MessageCircle, Tag, User, ArrowRight, Share2, Phone } from 'lucide-react';
import styles from './LandingPage.module.css';
import API_URL from '../../config';

const AdDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNumber, setShowNumber] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`${API_URL}/api/classifieds/${id}`);
                const data = await res.json();
                setAd(data);
            } catch (error) {
                console.error('Error fetching ad details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><div className="spinner"></div></div>;
    if (!ad) return <div style={{ textAlign: 'center', padding: '10rem' }}><h3>الإعلان غير موجود</h3><Link to="/ads">العودة للإعلانات</Link></div>;

    const handleWhatsApp = () => {
        let cleanPhone = ad.phoneNumber.replace(/\D/g, '');
        cleanPhone = cleanPhone.replace(/^0+/, '');
        if (cleanPhone.startsWith('5') && cleanPhone.length === 9) {
            cleanPhone = '966' + cleanPhone;
        }

        const message = `مرحباً، أنا مهتم بإعلانك "${ad.title}" على منصتي. هل لا يزال متاحاً؟`;
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const cleanPhone = ad.phoneNumber.replace(/\D/g, '');

        if (isMobile) {
            window.location.href = `tel:${cleanPhone}`;
        } else {
            setShowNumber(!showNumber);
        }
    };

    return (
        <div className={styles.landingContainer} style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container">
                {/* Breadcrumbs / Back */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/ads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
                        <ArrowRight size={18} />
                        العودة لجميع الإعلانات
                    </Link>
                </div>

                <div className={styles.adDetailsGrid}>
                    {/* Left: Images and Description */}
                    <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '100%' }}>
                        <div style={{ padding: '1.5rem' }}>
                            {/* Main Image */}
                            <div className={styles.adImageContainer}>
                                {ad.images && ad.images.length > 0 ? (
                                    <img src={ad.images[activeImage]} alt={ad.title} className={styles.adImage} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                        <Tag size={100} />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: 700 }}>
                                    {ad.type}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {ad.images && ad.images.length > 1 && (
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', padding: '0.5rem 0' }}>
                                    {ad.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                border: activeImage === idx ? '3px solid var(--primary)' : '2px solid transparent',
                                                padding: 0,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Ad Content */}
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(37, 99, 235, 0.1)', padding: '0.3rem 1rem', borderRadius: '20px' }}>{ad.category}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Clock size={16} />
                                        <span>تم النشر في {new Date(ad.createdAt).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                </div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b', wordBreak: 'break-word' }}>{ad.title}</h1>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>الموقع</div>
                                            <div style={{ fontWeight: 600 }}>{ad.location}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <Tag size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>السعر</div>
                                            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{ad.price > 0 ? `${ad.price} ر.س` : 'مجاني / على السوم'}</div>
                                        </div>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>التفاصيل</h3>
                                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                    {ad.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar with Actions */}
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 700 }}>
                                    {ad.user?.name?.charAt(0) || <User />}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{ad.user?.name || 'مستخدم غير معروف'}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>عضو منذ {new Date().getFullYear()} م</p>
                            </div>

                            <button
                                onClick={handleWhatsApp}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    background: '#25D366',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    marginBottom: '1rem'
                                }}
                            >
                                <MessageCircle size={22} />
                                دردشة عبر واتساب
                            </button>

                            <button
                                onClick={handleCall}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '16px',
                                    background: 'white',
                                    color: '#475569',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Phone size={20} />
                                {showNumber ? ad.phoneNumber : 'اتصال مباشر'}
                            </button>
                            {showNumber && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', textAlign: 'center', marginTop: '0.5rem', fontWeight: 600 }}>
                                    انقر للاتصال أو انسخ الرقم
                                </p>
                            )}
                        </div>

                        <div style={{ background: 'white', borderRadius: '24px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <h5 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>نصيحة للأمان</h5>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                ننصح دائماً بالمعاينة الشخصية للمنتج قبل الشراء، وعدم تحويل الأموال مسبقاً لأي جهة غير معروفة.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;
