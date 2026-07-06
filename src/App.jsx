import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { ProductProvider } from './context/ProductContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Products from './pages/dashboard/Products';
import AddProduct from './pages/dashboard/AddProduct';
import StoreSettings from './pages/dashboard/StoreSettings';
import LandingPage from './pages/public/LandingPage';
import StoreDetails from './pages/public/StoreDetails';
import ProductDetails from './pages/public/ProductDetails';
import AboutPage from './pages/public/AboutPage';
import Classifieds from './pages/public/Classifieds';
import AdDetails from './pages/public/AdDetails';
import CreateAd from './pages/dashboard/CreateAd';
import MyAds from './pages/dashboard/MyAds';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <StoreProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/store/:id" element={<StoreDetails />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/ads" element={<Classifieds />} />
              <Route path="/ads/:id" element={<AdDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="settings" element={<StoreSettings />} />
                <Route path="ads" element={<MyAds />} />
                <Route path="ads/new" element={<CreateAd />} />
                <Route path="ads/edit/:id" element={<CreateAd />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Router>
        </StoreProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
