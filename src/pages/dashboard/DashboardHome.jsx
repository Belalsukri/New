import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Box, Users } from 'lucide-react';
import { mockStats } from '../../utils/mockData';

const DashboardHome = () => {
    const getIcon = (index) => {
        switch (index) {
            case 0: return DollarSign;
            case 1: return ShoppingBag;
            case 2: return Box;
            case 3: return Users;
            default: return DollarSign;
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>نظرة عامة</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                {mockStats.map((stat, i) => {
                    const Icon = getIcon(i);
                    return (
                        <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
                                </div>
                                <div style={{
                                    background: '#f0f9ff',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--primary)'
                                }}>
                                    <Icon size={24} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: stat.isPositive ? 'var(--success)' : 'var(--danger)',
                                    fontWeight: 600
                                }}>
                                    {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span style={{ marginRight: '0.25rem' }}>{stat.change}</span>
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>مقارنة بالشهر الماضي</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>آخر النشاطات</h3>
                <p style={{ color: 'var(--text-muted)' }}>لا توجد نشاطات حديثة لعرضها حالياً.</p>
            </div>
        </div>
    );
};

export default DashboardHome;
