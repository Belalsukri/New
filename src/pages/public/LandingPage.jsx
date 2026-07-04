import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, TrendingUp, ShieldCheck, User, MapPin, Phone, Search, ChevronDown } from 'lucide-react';
import styles from './LandingPage.module.css';
import { useStores } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { GOVERNORATES, CATEGORIES } from '../../constants/locations';
import API_URL from '../../config';

const LandingPage = () => {
    const { stores, fetchStores } = useStores();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGovernorate, setSelectedGovernorate] = useState('الكل');
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [productResults, setProductResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [ads, setAds] = useState([]);

    // Fetch Ads
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${API_URL}/api/classifieds`);
                const data = await res.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim() || selectedGovernorate !== 'الكل' || selectedCategory !== 'الكل') {
                const performSearch = async () => {
                    setIsSearching(true);
                    try {
                        const params = new URLSearchParams();
                        if (searchQuery) params.append('keyword', searchQuery);
                        if (selectedGovernorate !== 'الكل') params.append('governorate', selectedGovernorate);
                        if (selectedCategory !== 'الكل') params.append('category', selectedCategory);

                        const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
                        const data = await res.json();
                        setProductResults(data);
                    } catch (error) {
                        console.error('Error searching:', error);
                    } finally {
                        setIsSearching(false);
                    }
                };
                performSearch();
            } else {
                setProductResults([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedGovernorate, selectedCategory]);

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div className={styles.landingContainer}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <div className={styles.logo}>
                        <Store size={28} color="var(--primary)" />
                        <span>منصتي</span>
                    </div>
                    <div className={styles.navLinks}>
                        <Link to="/ads" className={`btn btn-primary ${styles.navBtn}`} style={{ textDecoration: 'none' }}>الإعلانات الصغيرة</Link>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">لوحة التحكم</Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary">تسجيل الدخول</Link>
                                <Link to="/signup" className="btn btn-outline" style={{ background: 'white' }}>ابدأ متجرك مجاناً</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div className={styles.heroContent}>
                        <h1>اكتشف المتاجر في سوريا</h1>
                        <p>أول منصة متكاملة لدعم المتاجر المحلية</p>

                        <div className={styles.searchBarWrapper}>
                            {/* Search Input */}
                            <div className={styles.searchField}>
                                <Search color="var(--primary)" size={18} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="ما الذي تبحث عنه؟"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.filterContainer}>
                                {/* Category Filter */}
                                <div className={styles.filterField}>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'الكل' ? 'كل التصنيفات' : cat}</option>)}
                                    </select>
                                    <ChevronDown size={18} color="var(--text-muted)" className={styles.selectIcon} />
                                </div>

                                <div className={styles.divider}></div>

                                {/* Location Filter */}
                                <div className={styles.filterField}>
                                    <select
                                        value={selectedGovernorate}
                                        onChange={(e) => setSelectedGovernorate(e.target.value)}
                                    >
                                        {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov === 'الكل' ? 'كل المحافظات' : gov}</option>)}
                                    </select>
                                    <MapPin size={18} color="var(--primary)" className={styles.selectIcon} />
                                </div>

                                <button className={`btn btn-primary ${styles.searchBtn}`}>
                                    ابحث
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.heroOverlay}></div>

            </header>
            {/* Search Results Section - Show if searching by text OR filters */}
            {(searchQuery || selectedCategory !== 'الكل' || selectedGovernorate !== 'الكل') && (
                <section style={{ padding: '1.5rem 0', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
                    <div className="container">
                        <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                            <h2>نتائج البحث</h2>
                            <p>
                                {searchQuery && `عن "${searchQuery}"`}
                                {selectedCategory !== 'الكل' && ` في تصنيف ${selectedCategory}`}
                                {selectedGovernorate !== 'الكل' && ` في ${selectedGovernorate}`}
                            </p>
                        </div>

                        {isSearching ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <div className="spinner" style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid var(--primary)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 1rem'
                                }}></div>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                <p>جاري البحث...</p>
                            </div>
                        ) : productResults.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                                {productResults.map((product) => (
                                    <div key={product._id} className="card" style={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        background: 'white',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            aspectRatio: '1',
                                            background: '#f8fafc',
                                            borderBottom: '1px solid var(--border-color)',
                                            padding: '1rem'
                                        }}>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                    <ShoppingBag size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ marginBottom: 'auto' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                                                    {product.category || 'عام'}
                                                </div>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                                                    {product.name}
                                                </h3>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                    {product.price} ر.س
                                                </span>
                                                {product.store && (
                                                    <Link to={`/store/${typeof product.store === 'object' ? product.store._id : product.store}`} style={{
                                                        fontSize: '0.8rem',
                                                        color: 'var(--primary)',
                                                        textDecoration: 'none',
                                                        background: 'rgba(37, 99, 235, 0.1)',
                                                        padding: '0.3rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontWeight: 600
                                                    }}>
                                                        {typeof product.store === 'object' ? product.store.name : 'زيارة المتجر'}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <ShoppingBag size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <h3>لم يتم العثور على منتجات</h3>
                                <p>جرب البحث بكلمات مختلفة أو تصفح المتاجر أدناه</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Active Stores Section */}
            <section style={{ padding: '2rem 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>متاجرنا المميزة</h2>
                        <p>تصفح أحدث المتاجر المنضمة إلينا</p>
                    </div>

                    {/* Store/Ad Mixed Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {(() => {
                            const combinedItems = [];

                            // 1. Filter items first
                            const filteredStores = [...stores].filter(store => {
                                const matchesGov = selectedGovernorate === 'الكل' || store.governorate === selectedGovernorate;
                                const matchesCat = selectedCategory === 'الكل' || store.category === selectedCategory;
                                return matchesGov && matchesCat;
                            }).sort((a, b) => {
                                // First sort by Featured
                                if (a.isFeatured && !b.isFeatured) return -1;
                                if (!a.isFeatured && b.isFeatured) return 1;
                                // Then sort by CreatedAt (Newest first)
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            });

                            const filteredAds = [...ads].filter(ad => {
                                const matchesGov = selectedGovernorate === 'الكل' || ad.city === selectedGovernorate || ad.location?.includes(selectedGovernorate);
                                const matchesCat = selectedCategory === 'الكل' || ad.category === selectedCategory;
                                return matchesGov && matchesCat;
                            });

                            // 2. Interleave Logic on Filtered Lists
                            const storeItems = filteredStores;
                            const adItems = filteredAds;
                            let storeIdx = 0;
                            let adIdx = 0;

                            while (storeIdx < storeItems.length || adIdx < adItems.length) {
                                // Add 6 stores
                                for (let i = 0; i < 6 && storeIdx < storeItems.length; i++) {
                                    combinedItems.push({ type: 'store', ...storeItems[storeIdx++] });
                                }
                                // Add 3 ads
                                for (let i = 0; i < 3 && adIdx < adItems.length; i++) {
                                    combinedItems.push({ type: 'ad', ...adItems[adIdx++] });
                                }
                            }

                            if (combinedItems.length === 0) {
                                return (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                        <h3>لا توجد نتائج مطابقة للبحث الحالي</h3>
                                        <p>يرجى تجربة فئات أو محافظات أخرى</p>
                                    </div>
                                );
                            }

                            return combinedItems.map((item, index) => {
                                if (item.type === 'store') {
                                    return (
                                        <Link key={`store-${item._id}`} to={`/store/${item._id}`} className="card" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            border: item.isFeatured ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            padding: 0,
                                            borderRadius: '16px',
                                            background: 'white',
                                            height: '100%'
                                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                            <div style={{
                                                padding: '0.75rem 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                background: 'white',
                                                direction: 'rtl'
                                            }}>
                                                <div style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: '1px solid #e2e8f0',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#f8fafc'
                                                }}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <Store size={20} color="var(--primary)" />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{item.name}</h3>
                                                </div>
                                                {item.isFeatured && (
                                                    <div style={{
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700
                                                    }}>مميز</div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'white' }}>
                                                {item.lastProduct && item.lastProduct.images?.[0] ? (
                                                    <div style={{
                                                        width: '100%',
                                                        aspectRatio: '1',
                                                        position: 'relative',
                                                        borderTop: '1px solid var(--border-color)',
                                                        borderBottom: '1px solid var(--border-color)',
                                                        overflow: 'hidden',
                                                        background: '#f8fafc',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <img
                                                            src={item.lastProduct.images[0]}
                                                            alt={item.lastProduct.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                                                        />
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            background: 'rgba(255, 255, 255, 0.95)',
                                                            padding: '0.75rem 1rem',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            backdropFilter: 'blur(4px)',
                                                            borderTop: '1px solid rgba(0,0,0,0.05)'
                                                        }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>وصل حديثاً</span>
                                                                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.lastProduct.name}</span>
                                                            </div>
                                                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{item.lastProduct.price} ر.س</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'center' }}>
                                                            {item.description || 'لا يوجد وصف للمتجر'}
                                                        </p>
                                                    </div>
                                                )}
                                                {!item.lastProduct && (
                                                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        {item.address && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <MapPin size={16} />
                                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                } else {
                                    // Render Ad Card
                                    return (
                                        <Link key={`ad-${item._id}`} to={`/ads/${item._id}`} className="card" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            padding: 0,
                                            borderRadius: '16px',
                                            background: 'white',
                                            height: '100%'
                                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                            <div style={{
                                                padding: '0.75rem 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                background: 'white',
                                                direction: 'rtl'
                                            }}>
                                                <div style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: '1px solid #e2e8f0',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#f8fafc'
                                                }}>
                                                    <User size={20} color="var(--primary)" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{item.user?.name || 'مستخدم'}</h3>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'white' }}>
                                                <div style={{
                                                    width: '100%',
                                                    aspectRatio: '1',
                                                    position: 'relative',
                                                    borderTop: '1px solid var(--border-color)',
                                                    borderBottom: '1px solid var(--border-color)',
                                                    overflow: 'hidden',
                                                    background: '#f8fafc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {item.images && item.images.length > 0 ? (
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                                                        />
                                                    ) : (
                                                        <ShoppingBag size={48} color="#cbd5e1" />
                                                    )}
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                        padding: '0.75rem 1rem',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backdropFilter: 'blur(4px)',
                                                        borderTop: '1px solid rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>إعلان</span>
                                                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.title}</span>
                                                        </div>
                                                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{item.price > 0 ? `${item.price} ر.س` : 'سوم'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }
                            });
                        })()}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features} id="features">
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>لماذا تختار منصتي؟</h2>
                        <p>كل ما تحتاجه للنجاح في التجارة الإلكترونية</p>
                    </div>

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Store size={32} /></div>
                            <h3>متجر خاص بك</h3>
                            <p>هوية مستقلة لمتجرك مع رابط مباشر ولوحة تحكم متكاملة.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><TrendingUp size={32} /></div>
                            <h3>زيادة المبيعات</h3>
                            <p>أدوات تسويقية وإحصائيات دقيقة لمساعدتك على تنمية تجارتك.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><ShieldCheck size={32} /></div>
                            <h3>دفع آمن</h3>
                            <p>بوابات دفع متنوعة ومؤمنة لضمان حقوقك وحقوق عملائك.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
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
                            <Link to="/ads" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>الإعلانات الصغيرة</Link>
                        </div>
                        <p style={{ margin: 0 }}>© 2026 منصتي. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
