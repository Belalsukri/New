import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, MessageCircle, ChevronRight, ChevronLeft, ShoppingBag, Home } from 'lucide-react';
import API_URL from '../../config';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>جاري التحميل...</div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '5rem' }}>المنتج غير موجود.</div>;

    const store = product.store || {};

    const nextImg = () => {
        if (product.images && product.images.length > 1) {
            setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImg = () => {
        if (product.images && product.images.length > 1) {
            setCurrentImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    };

    let whatsappUrl = '#';
    if (store.phoneNumber) {
        let cleanPhone = store.phoneNumber.replace(/\D/g, '');
        cleanPhone = cleanPhone.replace(/^0+/, '');
        if (cleanPhone.startsWith('5') && cleanPhone.length === 9) {
            cleanPhone = '966' + cleanPhone;
        }
        const imageUrl = product.images?.[0] || '';
        const isRemoteUrl = imageUrl.startsWith('http');
        const message = `مرحباً، أنا مهتم بمنتج ${product.name} من متجرك ${store.name}.\n\n${isRemoteUrl ? `رابط الصورة: ${imageUrl}\n\n` : ''}هل يمكنني الحصول على معلومات إضافية؟`;
        whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    }

    return (
        <div style={{ paddingBottom: '6rem', background: '#f8fafc', minHeight: '100vh', direction: 'rtl' }}>
            {/* Store Header */}
            <div style={{
                background: 'white',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <Link to={`/store/${store._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                    {store.image ? (
                        <img src={store.image} alt={store.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Store size={20} color="var(--primary)" />
                        </div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{store.name}</span>
                </Link>
                
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', textDecoration: 'none', background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' }}>
                    <Home size={20} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>الرئيسية</span>
                </Link>
            </div>

            {/* Product Images Gallery */}
            <div style={{ background: 'white', position: 'relative', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.images && product.images.length > 0 ? (
                    <>
                        <img src={product.images[currentImgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        
                        {product.images.length > 1 && (
                            <>
                                <button onClick={prevImg} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                    <ChevronRight size={24} />
                                </button>
                                <button onClick={nextImg} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                    <ChevronLeft size={24} />
                                </button>
                                <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '5px', left: '50%', transform: 'translateX(-50%)' }}>
                                    {product.images.map((_, idx) => (
                                        <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentImgIndex === idx ? 'var(--primary)' : 'rgba(0,0,0,0.2)' }} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ color: '#cbd5e1' }}><ShoppingBag size={64} /></div>
                )}
            </div>

            <div style={{ padding: '1rem' }}>
                {/* Product Info */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: '1.4' }}>{product.name}</h1>
                    <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>
                        {product.price} ر.س
                    </div>
                    {product.description && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>تفاصيل المنتج</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{product.description}</p>
                        </div>
                    )}
                </div>

                {/* Store Info */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#475569' }}>معلومات المتجر</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        {store.image ? (
                            <img src={store.image} alt={store.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Store size={24} color="var(--primary)" />
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{store.name}</div>
                            {store.address && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                    <MapPin size={14} />
                                    <span>{store.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Link to={`/store/${store._id}`} className="btn btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%', textDecoration: 'none', padding: '0.75rem', borderRadius: '8px' }}>
                        عرض جميع منتجات المتجر
                    </Link>
                </div>
            </div>

            {/* Bottom Actions */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                padding: '1rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '1rem',
                zIndex: 100,
                boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                {store.phoneNumber ? (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#25D366',
                            borderColor: '#25D366',
                            textDecoration: 'none',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1.1rem'
                        }}
                    >
                        <MessageCircle size={24} />
                        تواصل عبر واتساب
                    </a>
                ) : (
                    <div style={{ flex: 1, textAlign: 'center', color: '#94a3b8', padding: '0.75rem' }}>لا يتوفر رقم للتواصل</div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
