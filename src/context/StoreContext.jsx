import { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

// Mock initial stores - REMOVED
// const initialStores = [];

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [stores, setStores] = useState([]);

    const fetchStores = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stores`);
            const data = await res.json();
            setStores(data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const addStore = async (storeData) => {
        // Implementation for adding store via API if needed
        // For now, stores are created during signup
        console.log('addStore called with', storeData);
    };

    return (
        <StoreContext.Provider value={{ stores, addStore, fetchStores }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStores = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStores must be used within a StoreProvider');
    }
    return context;
};
