import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Settings, LogOut, Store, Menu, ShieldCheck, Home, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

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
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <Store size={24} color="var(--primary)" />
                        <span>منصتي</span>
                    </div>
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
