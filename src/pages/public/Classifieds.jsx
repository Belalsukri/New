import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, MapPin, Clock, MessageCircle, ShoppingBag, Plus, Store } from 'lucide-react';
import styles from './LandingPage.module.css'; // Reuse landing page styles for consistency
import API_URL from '../../config';

const Classifieds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (category) params.append('category', category);
            if (type) params.append('type', type);

            const res = await fetch(`${API_URL}/api/ads?${params.toString()}`);
            const data = await res.json();
            setAds(data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAds();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, category, type]);

    const categories = ['الكترونيات', 'أثاث', 'وظائف', 'خدمات', 'سيارات', 'أخرى'];
    const types = ['بيع', 'شراء', 'وظيفة', 'معلومة'];

    return (
        <div className={styles.landingContainer}>
            {/* Navbar */}
            <nav className={styles.navbar} style={{ background: 'white', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', padding: '0 1rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <Store size={28} color="var(--primary)" />
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>منصتي</span>
                    </Link>
                    <div className={styles.navLinks} style={{ gap: '0.5rem', display: 'flex' }}>
                        <Link to="/" className="btn btn-outline" style={{
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            border: '1px solid var(--border-color)', // Uniform border
                            background: 'white',
                            color: 'var(--text-primary)',
                            padding: '0 1rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>الرئيسية</Link>
                        <Link to="/dashboard" className="btn btn-outline" style={{
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            border: '1px solid var(--border-color)', // match Home button border exactly
                            background: 'white',
                            color: 'var(--text-primary)', // match Home button color exactly for uniformity, or keep primary if user wants color distinction but same SHAPE. User asked for "same background" and "unify border".
                            padding: '0 1rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>لوحة التحكم</Link>
                    </div>
                </div>
            </nav>

            {/* Header / Hero for Classifieds - Tightened spacing */}
            <header className={styles.hero} style={{ minHeight: 'auto', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '1.5rem 0', marginTop: '0' }}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', fontWeight: 800, color: 'white' }}>الإعلانات الصغيرة</h1>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>ابحث عن كل شيء، من الأدوات المستعملة إلى الوظائف</p>

                        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                            <input
                                type="text"
                                placeholder="ابحث في الإعلانات..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 3rem 0.8rem 1.5rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <Search
                                color="#94a3b8"
                                size={18}
                                style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters and List - Reduced top padding */}
            <main className="container" style={{ padding: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%', alignItems: 'center' }} className="hide-scrollbar">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ padding: '0 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem', height: '40px', fontWeight: 600, minWidth: 'fit-content' }}
                        >
                            <option value="">كل التصنيفات</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{ padding: '0 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem', height: '40px', fontWeight: 600, minWidth: 'fit-content' }}
                        >
                            <option value="">كل الأنواع</option>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <Link to="/dashboard/ads/new" className="btn btn-primary" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            padding: '0 0.8rem',
                            height: '40px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            whiteSpace: 'nowrap',
                            minWidth: 'fit-content'
                        }}>
                            <Plus size={18} />
                            أضف إعلانك
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>جاري تحميل الإعلانات...</p>
                    </div>
                ) : ads.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: isMobile ? '1rem' : '1.5rem',
                        width: '100%'
                    }}>
                        {ads.map((ad) => (
                            <Link key={ad._id} to={`/ads/${ad._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card" style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease',
                                    background: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    padding: 0
                                }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ height: '220px', background: 'white', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {ad.images && ad.images.length > 0 ? (
                                            <img src={ad.images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                <Tag size={48} />
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '0.75rem',
                                            left: '0.75rem',
                                            background: 'rgba(30, 41, 59, 0.8)',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            {ad.type}
                                        </div>
                                    </div>
                                    <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{ad.category}</div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', height: '1.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{ad.title}</h3>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: '#64748b',
                                            lineHeight: '1.4',
                                            marginBottom: '0.25rem',
                                            height: '2.2rem', // Reduced height (2 lines approx)
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {ad.description}
                                        </p>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            {ad.description.length > 100 ? (
                                                <Link to={`/ads/${ad._id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.75rem', textDecoration: 'none' }}>اقرأ المزيد...</Link>
                                            ) : (
                                                <Link to={`/ads/${ad._id}`} style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textDecoration: 'none' }}>تفاصيل</Link>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                            <MapPin size={12} />
                                            <span>{ad.location}</span>
                                        </div>
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{ad.price > 0 ? `${ad.price} ر.س` : 'مجاني'}</span>
                                            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}>
                                                <Clock size={11} />
                                                <span>{new Date(ad.createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </Link >
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '20px' }}>
                        <ShoppingBag size={64} style={{ color: '#cbd5e1', marginBottom: '1.5rem' }} />
                        <h3>لا توجد إعلانات حالياً</h3>
                        <p style={{ color: 'var(--text-muted)' }}>كن أول من يضيف إعلاناً في هذا التصنيف</p>
                    </div>
                )}
            </main >

            {/* Footer */}
            < footer className={styles.footer} style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', background: 'white', padding: '2rem 0' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>عن المطور</Link>
                            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>الرئيسية</Link>
                        </div>
                        <p style={{ margin: 0 }}>© 2026 منصتي. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default Classifieds;
