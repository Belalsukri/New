import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Upload, Save, X } from 'lucide-react';
import { CATEGORIES } from '../../constants/locations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const AddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addProduct, updateProduct, myProducts, fetchMyProducts } = useProducts();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    // Cropper State
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: null
    });

    useEffect(() => {
        if (id) {
            // Edit Mode
            const product = Array.isArray(myProducts) ? myProducts.find(p => p._id === id) : null;
            if (product) {
                setFormData({
                    name: product.name || '',
                    price: product.price || '',
                    category: product.category || '',
                    description: product.description || '',
                    image: product.images?.[0] || null
                });
                setImagePreview(product.images?.[0] || null);
            } else {
                // Not found in current list, try fetching
                fetchMyProducts();
            }
        }
    }, [id, myProducts, fetchMyProducts]);

    const handleImageSelection = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setTempImage(result);
                // Set as current image immediately (Natural/Original)
                setImagePreview(result);
                setFormData(prev => ({ ...prev, image: result }));
                // Do not auto-open cropper: setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const saveCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            setImagePreview(croppedImage);
            setFormData(prev => ({ ...prev, image: croppedImage }));
            setIsCropping(false);
            setTempImage(null); // Clear tempImage after cropping
        } catch (e) {
            console.error(e);
            setError('فشل قص الصورة');
        }
    };

    const cancelCrop = () => {
        setIsCropping(false);
        // If tempImage was set from a new file, clear it.
        // If it was an existing image, we don't want to clear imagePreview.
        // For now, let's assume tempImage is only for the current cropping session.
        setTempImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setTempImage(null); // Also clear tempImage if it was set
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let result;

        try {
            if (id) {
                result = await updateProduct(id, formData);
            } else {
                result = await addProduct(formData);
            }

            if (result && result.success) {
                navigate('/dashboard/products');
            } else {
                setError(result?.error || (id ? 'فشل تحديث المنتج' : 'فشل إضافة المنتج'));
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ غير متوقع');
        }
    };

    // Inline styles to replace CSS module usage for safety
    const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' };
    const inputStyle = { padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.95rem' };

    return (
        <div>
            {/* Cropper Modal */}
            {isCropping && tempImage && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'black', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', flex: 1, background: '#333' }}>
                        <Cropper
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Square
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        direction: 'rtl'
                    }}>
                        <div style={{ flex: 1, maxWidth: '300px' }}>
                            <label>تقريب: {zoom}</label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="zoom-range"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button onClick={cancelCrop} className="btn btn-outline">إلغاء</button>
                        <button onClick={saveCroppedImage} className="btn btn-primary">قص وحفظ</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/dashboard/products" className="btn btn-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={20} />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={inputGroupStyle}>
                        <label style={{ fontWeight: 500 }}>اسم المنتج</label>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="مثال: آيفون 13"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontWeight: 500 }}>السعر (ر.س)</label>
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontWeight: 500 }}>التصنيف</label>
                        <select
                            style={inputStyle}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">اختر تصنيفاً</option>
                            {CATEGORIES.filter(c => c !== 'الكل').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontWeight: 500 }}>وصف المنتج</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
                            rows="4"
                            placeholder="اكتب وصفاً تفصيلياً للمنتج..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontWeight: 500 }}>صور المنتج   (سيتم قص الصورة لتكون مربعة)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelection}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />

                        {!imagePreview ? (
                            <div
                                onClick={triggerFileInput}
                                style={{
                                    border: '2px dashed #94a3b8',
                                    borderRadius: '8px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary, #2563eb)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                            >
                                <Upload size={32} color="#64748b" style={{ marginBottom: '1rem' }} />
                                <p style={{ color: '#64748b' }}>اضغط لرفع صورة المنتج</p>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#f8fafc'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    display: 'flex',
                                    gap: '0.5rem'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Set tempImage to current imagePreview for editing
                                            setTempImage(imagePreview);
                                            setIsCropping(true);
                                        }}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                        title="قص وتعديل"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                        title="حذف"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/dashboard/products" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'inherit' }}>إلغاء</Link>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <Save size={18} />
                            {id ? 'حفظ التعديلات' : 'حفظ المنتج'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;
