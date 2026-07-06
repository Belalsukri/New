import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, TrendingUp, ShieldCheck, User, MapPin, Phone, Search, ChevronDown, Facebook, Instagram, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LandingPage.module.css';
import { useStores } from '../../context/StoreContext';
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
                    <Link to="/" className={styles.logo}>
                        <div className={styles.logoIcon} style={{ background: 'transparent' }}>
                            <img src="/logo.png" alt="جوري" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        </div>
                        <span>جوري</span>
                    </Link>
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
                            <div className={styles.itemsGrid}>
                                {productResults.map((product) => (
                                    <Link to={`/product/${product._id}`} key={product._id} className={styles.temuCard} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <div className={styles.temuImageContainer}>
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <ShoppingBag size={48} color="#cbd5e1" />
                                            )}
                                        </div>
                                        <div className={styles.temuCardBody}>
                                            <h3 className={styles.temuCardTitle}>
                                                {product.name}
                                            </h3>
                                            <div className={styles.temuCardPrice}>
                                                {product.price} ل.س
                                            </div>
                                        </div>
                                    </Link>
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
                    <div className={styles.itemsGrid}>
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
                                        <Link key={`store-${item._id}`} to={item.lastProduct ? `/product/${item.lastProduct._id}` : `/store/${item._id}`} className={styles.temuCard} style={{textDecoration: 'none', color: 'inherit'}}>
                                            <div className={styles.temuImageContainer}>
                                                {item.lastProduct && item.lastProduct.images?.[0] ? (
                                                    <img src={item.lastProduct.images[0]} alt={item.name} />
                                                ) : item.image ? (
                                                    <img src={item.image} alt={item.name} />
                                                ) : (
                                                    <Store size={48} color="#cbd5e1" />
                                                )}
                                            </div>
                                            <div className={styles.temuCardBody}>
                                                <h3 className={styles.temuCardTitle}>
                                                    {item.lastProduct ? item.lastProduct.name : item.name}
                                                </h3>
                                                <div className={styles.temuCardPrice}>
                                                    {item.lastProduct ? `${item.lastProduct.price} ل.س` : 'تصفح المتجر'}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                } else {
                                    // Render Ad Card
                                    return (
                                        <Link key={`ad-${item._id}`} to={`/ads/${item._id}`} className={styles.temuCard} style={{textDecoration: 'none'}}>
                                            <div className={styles.temuImageContainer}>
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0]} alt={item.title} />
                                                ) : (
                                                    <ShoppingBag size={48} color="#cbd5e1" />
                                                )}
                                            </div>
                                            <div className={styles.temuCardBody}>
                                                <h3 className={styles.temuCardTitle}>
                                                    {item.title}
                                                </h3>
                                                <div className={styles.temuCardPrice}>
                                                    {item.price > 0 ? `${item.price} ل.س` : 'سوم'}
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
                        <h2>لماذا تختار جوري؟</h2>
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
                            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>عن المطور</Link>
                            <Link to="/ads" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>الإعلانات الصغيرة</Link>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', margin: '0.5rem 0' }}>
                            <a href="#" style={{ color: 'var(--primary)' }}><Facebook size={24} /></a>
                            <a href="#" style={{ color: 'var(--primary)' }}><Instagram size={24} /></a>
                        </div>
                        <p style={{ margin: 0 }}>© 2026 جوري. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
