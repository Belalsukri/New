const DashboardHome = () => {
    return (
        <div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                    مرحباً بك في لوحة التحكم
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    يمكنك إدارة منتجاتك، إعلاناتك، وإعدادات متجرك من القائمة الجانبية.
                </p>
            </div>
        </div>
    );
};

export default DashboardHome;
