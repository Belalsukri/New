import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, Upload, X, Save, Loader, Tag, Info, Crop } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const CreateAd = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { token } = useAuth();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [images, setImages] = useState([]);
    
    // Cropper State
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [currentCropIndex, setCurrentCropIndex] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'الكترونيات',
        type: 'بيع',
        location: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchAd = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/classifieds/${id}`);
                    const data = await res.json();
                    setFormData({
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        category: data.category,
                        type: data.type,
                        location: data.location,
                        phoneNumber: data.phoneNumber
                    });
                    setImages(data.images || []);
                } catch (error) {
                    console.error('Error fetching ad:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAd();
        }
    }, [id, isEdit]);

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    setImages(prev => [...prev, result]);
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
            const newPreviews = [...images];
            newPreviews[currentCropIndex] = croppedImage;
            setImages(newPreviews);
            setIsCropping(false);
            setTempImage(null);
            setCurrentCropIndex(null);
        } catch (e) {
            console.error('Error cropping image:', e);
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
        setImages(images.filter((_, i) => i !== index));
    };

    const openCropper = (index, e) => {
        e.stopPropagation();
        setTempImage(images[index]);
        setCurrentCropIndex(index);
        setIsCropping(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(isEdit ? `${API_URL}/api/classifieds/${id}` : `${API_URL}/api/classifieds`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, images }),
            });
            if (res.ok) {
                navigate('/dashboard/ads');
            }
        } catch (error) {
            console.error('Error saving ad:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Cropper Modal */}
            {isCropping && tempImage && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'black', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', flex: 1, background: '#333' }}>
                        <Cropper
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div style={{ padding: '1rem', background: '#222', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button type="button" onClick={saveCroppedImage} style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                            قص وحفظ
                        </button>
                        <button type="button" onClick={cancelCrop} style={{ background: '#475569', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/dashboard/ads" style={{ color: 'var(--text-muted)' }}><ArrowRight /></Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{isEdit ? 'تعديل الإعلان' : 'نشر إعلان جديد'}</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '2rem', background: 'white', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>معلومات الإعلان</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>العنوان</label>
                            <input
                                className="input"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="مثال: آيفون 13 برو نظيف جداً"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>وصف الإعلان</label>
                            <textarea
                                className="input"
                                required
                                rows="6"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="اكتب تفاصيل الإعلان هنا..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>التصنيف</label>
                                <select
                                    className="input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {['الكترونيات', 'أثاث', 'وظائف', 'خدمات', 'سيارات', 'أخرى'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>نوع الإعلان</label>
                                <select
                                    className="input"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {['بيع', 'شراء', 'وظيفة', 'معلومة'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', background: 'white', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>الصور</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                            <div
                                onClick={triggerFileInput}
                                style={{
                                    height: '120px',
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <Upload size={24} />
                                <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>إضافة صورة</span>
                            </div>
                            <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleImageSelection} />
                            
                            {images.map((img, idx) => (
                                <div key={idx} style={{ height: '120px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    
                                    <button
                                        type="button"
                                        onClick={(e) => openCropper(idx, e)}
                                        style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(37, 99, 235, 0.8)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                    >
                                        <Crop size={14} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => removeImage(idx, e)}
                                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '2rem', background: 'white', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>التواصل والموقع</h3>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>رقم الجوال (واتساب)</label>
                            <input
                                className="input"
                                required
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="09xxxxxxxx"
                            />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>الموقع والمدينة</label>
                            <input
                                className="input"
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="دمشق، حلب..."
                            />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>السعر (اختياري)</label>
                            <input
                                className="input"
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="ل.س"
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>اتركه فارغاً أو 0 إذا كان غير محدد</p>
                        </div>
                    </div>

                    <div style={{ background: '#eff6ff', borderRadius: '20px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <Info size={20} color="var(--primary)" />
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af', lineHeight: '1.6' }}>
                            سيظهر إعلانك في قسم الإعلانات الصغيرة العامة. تأكد من دقة المعلومات لإتمام البيع بسرعة.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '16px' }}
                    >
                        {saving ? <Loader className="spin" /> : <><Save size={20} style={{ marginLeft: '0.5rem' }} /> {isEdit ? 'حفظ التغييرات' : 'نشر الإعلان الآن'}</>}
                    </button>
                    <Link to="/dashboard/ads" className="btn btn-outline" style={{ width: '100%', background: 'transparent' }}>إلغاء</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateAd;
