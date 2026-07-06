import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Settings, LogOut, Store, Menu, ShieldCheck, Home, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, loading } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><div className="spinner"></div></div>;
    if (!user) return null;

    const navItems = [
        { icon: Home, label: 'الصفحة الرئيسية', path: '/' },
        { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard' },
        ...(user?.role === 'admin' ? [{ icon: ShieldCheck, label: 'إدارة المنصة', path: '/dashboard/admin' }] : []),
        { icon: Package, label: 'المنتجات', path: '/dashboard/products' },
        { icon: Tag, label: 'إعلاناتي', path: '/dashboard/ads' },
        { icon: Store, label: 'إعدادات المتجر', path: '/dashboard/settings' },
    ];

    return (
        <div className={styles.container}>
            {isMobile && sidebarOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                        background: 'rgba(0,0,0,0.5)', zIndex: 90
                    }}
                />
            )}
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1e293b' }}>
                        <img src="/logo.png" alt="جوري" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>جوري</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => { if (isMobile) setSidebarOpen(false); }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={() => {
                        logout();
                        navigate('/login');
                    }}>
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className={styles.headerActions}>
                        <span className={styles.userName}>مرحباً، {user?.name || 'مستخدم'}</span>
                        <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
                    </div>
                </header>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
