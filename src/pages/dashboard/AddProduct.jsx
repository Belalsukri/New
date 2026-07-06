import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Upload, Save, X, Crop } from 'lucide-react';
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
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');

    // Cropper State
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [currentCropIndex, setCurrentCropIndex] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        images: []
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
                    images: product.images || []
                });
                setImagesPreview(product.images || []);
            } else {
                fetchMyProducts();
            }
        }
    }, [id, myProducts, fetchMyProducts]);

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    setImagesPreview(prev => [...prev, result]);
                    setFormData(prev => ({ ...prev, images: [...prev.images, result] }));
                };
                reader.readAsDataURL(file);
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const saveCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            
            const newPreviews = [...imagesPreview];
            newPreviews[currentCropIndex] = croppedImage;
            setImagesPreview(newPreviews);
            
            setFormData(prev => ({ ...prev, images: newPreviews }));
            
            setIsCropping(false);
            setTempImage(null);
            setCurrentCropIndex(null);
        } catch (e) {
            console.error(e);
            setError('فشل قص الصورة');
        }
    };

    const cancelCrop = () => {
        setIsCropping(false);
        setTempImage(null);
        setCurrentCropIndex(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (index, e) => {
        e.stopPropagation();
        const newPreviews = imagesPreview.filter((_, i) => i !== index);
        setImagesPreview(newPreviews);
        setFormData(prev => ({ ...prev, images: newPreviews }));
    };

    const openCropper = (index, e) => {
        e.stopPropagation();
        setTempImage(imagesPreview[index]);
        setCurrentCropIndex(index);
        setIsCropping(true);
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
                        <button type="button" onClick={cancelCrop} className="btn btn-outline">إلغاء</button>
                        <button type="button" onClick={saveCroppedImage} className="btn btn-primary">قص وحفظ</button>
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
                        <label style={{ fontWeight: 500 }}>السعر (ل.س)</label>
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
                        <label style={{ fontWeight: 500 }}>صور المنتج (يمكنك إضافة صور متعددة)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelection}
                            style={{ display: 'none' }}
                            accept="image/*"
                            multiple
                        />

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {imagesPreview.map((preview, index) => (
                                <div key={index} style={{ position: 'relative', width: '150px', height: '150px' }}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
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
                                        gap: '0.3rem'
                                    }}>
                                        <button
                                            type="button"
                                            onClick={(e) => openCropper(index, e)}
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                            title="قص الصورة"
                                        >
                                            <Crop size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => removeImage(index, e)}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                            title="حذف الصورة"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div
                                onClick={triggerFileInput}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    border: '2px dashed #94a3b8',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    transition: 'all 0.2s',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                            >
                                <Upload size={24} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>إضافة صورة</span>
                            </div>
                        </div>
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
