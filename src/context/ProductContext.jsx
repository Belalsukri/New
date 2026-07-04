import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const { token } = useAuth();

    // Fetch public products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData),
            });
            const data = await res.json();
            if (res.ok) {
                setProducts([data, ...products]); // Optimistic update or refetch
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const [myProducts, setMyProducts] = useState([]);

    const fetchMyProducts = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/products/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMyProducts(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMyProducts(prev => prev.filter(p => p._id !== id));
                setProducts(prev => prev.filter(p => p._id !== id));
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData),
            });
            const data = await res.json();
            if (res.ok) {
                setMyProducts(prev => prev.map(p => p._id === id ? data : p));
                setProducts(prev => prev.map(p => p._id === id ? data : p));
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return (
        <ProductContext.Provider value={{ products, myProducts, fetchMyProducts, addProduct, deleteProduct, updateProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
