import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';

const Products = () => {
    const { myProducts, fetchMyProducts, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            const result = await deleteProduct(id);
            if (!result.success) {
                alert(result.error || 'فشل حذف المنتج');
            }
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const filteredProducts = myProducts.filter(p =>
        p.name.includes(searchTerm) || p.category.includes(searchTerm)
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>المنتجات</h1>
                <Link to="/dashboard/products/new" className="btn btn-primary">
                    <Plus size={18} style={{ marginLeft: '0.5rem' }} />
                    إضافة منتج
                </Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            style={{ paddingRight: '2.5rem' }}
                            placeholder="ابحث عن منتج..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>المنتج</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>التصنيف</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>السعر</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            {product.images?.[0] && <img src={product.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{product.category}</td>
                                    <td style={{ padding: '1rem' }}>{product.price} ر.س</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/dashboard/products/edit/${product._id}`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
