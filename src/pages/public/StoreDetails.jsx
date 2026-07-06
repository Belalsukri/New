import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, ShoppingBag, MapPin, Phone, X, MessageCircle } from 'lucide-react';
import styles from './LandingPage.module.css';
import API_URL from '../../config';

const StoreDetails = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [storeLoading, setStoreLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                // Fetch specific store directly
                const storeRes = await fetch(`${API_URL}/api/stores/${id}`);
                if (!storeRes.ok) {
                    throw new Error('Store not found');
                }
                const currentStore = await storeRes.json();
                setStore(currentStore);
            } catch (error) {
                console.error('Error fetching store details:', error);
            } finally {
                setStoreLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                // Fetch products for this store
                const prodRes = await fetch(`${API_URL}/api/products?storeId=${id}`);
                const prodData = await prodRes.json();
                setProducts(prodData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setProductsLoading(false);
            }
        };

        setStoreLoading(true);
        setProductsLoading(true);
        fetchStore();
        fetchProducts();
    }, [id]);

    if (storeLoading) return <div style={{ textAlign: 'center', padding: '5rem' }}>جاري التحميل...</div>;
    if (!store) return <div style={{ textAlign: 'center', padding: '5rem' }}>المتجر غير موجود.</div>;

    return (
        <div className={styles.landingContainer}>
            {/* New Hero Section */}
            <div style={{
                position: 'relative',
                width: '100%',
                minHeight: '400px',
                background: store.bannerImage ? `url(${store.bannerImage}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl', width: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none' }}>
                        <div style={{ background: 'white', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                            <img src="/logo.png" alt="جوري" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>جوري</span>
                    </Link>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>الرئيسية</span>
                    </Link>
                </div>

                <div style={{ position: 'relative', zIndex: 10, paddingBottom: '3rem', marginTop: '-60px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'white',
                            padding: '4px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            flexShrink: 0
                        }}>
                            {store.image ? (
                                <img src={store.image} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Store size={48} color="var(--primary)" />
                                </div>
                            )}
                        </div>

                        <div style={{ paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{store.name}</h1>
                            {store.description && (
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '1rem', lineHeight: '1.6' }}>{store.description}</p>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {store.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', opacity: 0.9 }}>
                                        <MapPin size={18} />
                                        <span>{store.address}</span>
                                    </div>
                                )}
                                {store.phoneNumber && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', opacity: 0.9 }}>
                                        <Phone size={18} />
                                        <a href={`tel:${store.phoneNumber}`} style={{ color: 'white', textDecoration: 'none' }} dir="ltr">
                                            {store.phoneNumber}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main style={{ padding: '4rem 0' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '2rem' }}>منتجاتنا</h2>

                    {productsLoading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
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
                            <p>جاري تحميل المنتجات...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)' }}>لا توجد منتجات في هذا المتجر حالياً.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                            {products.map((product) => (
                                <div key={product._id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                                        <div style={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            background: '#f1f5f9',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: '1rem',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                                    <ShoppingBag size={32} color="#cbd5e1" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.description}</p>
                                        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>{product.price} ل.س</p>
                                    </Link>
                                    {(() => {
                                        if (!store.phoneNumber) return null;

                                        let cleanPhone = store.phoneNumber.replace(/\D/g, '');
                                        cleanPhone = cleanPhone.replace(/^0+/, '');
                                        if (cleanPhone.startsWith('9') && cleanPhone.length === 9) {
                                            cleanPhone = '963' + cleanPhone;
                                        }

                                        const imageUrl = product.images?.[0] || '';
                                        const isRemoteUrl = imageUrl.startsWith('http');
                                        const message = `مرحباً، أنا مهتم بمنتج ${product.name} من متجرك ${store.name}.\n\n${isRemoteUrl ? `رابط الصورة: ${imageUrl}\n\n` : ''}هل يمكنني الحصول على معلومات؟`;
                                        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

                                        return (
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary"
                                                style={{
                                                    width: '100%',
                                                    marginTop: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: '#25D366',
                                                    borderColor: '#25D366',
                                                    textDecoration: 'none',
                                                    color: 'white'
                                                }}
                                            >
                                                <MessageCircle size={18} />
                                                دردشة عبر واتساب
                                            </a>
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            {/* Image Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} color="black" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size"
                        style={{
                            height: '80vh',
                            width: 'auto',
                            maxWidth: '90vw',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default StoreDetails;
