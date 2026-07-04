import React from 'react';
import { Link } from 'react-router-dom';
import { Code, TrendingUp, ArrowLeft, Mail, Globe, Github } from 'lucide-react';

const AboutPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', direction: 'rtl' }}>
            {/* Navbar (Simplified) */}
            <nav style={{ background: 'white', padding: '1rem 0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
                            <ArrowLeft size={20} />
                            <span>العودة للرئيسية</span>
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Add any other nav items if needed, or just keep it simple */}
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>عن المطور</div>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>
                            بناء تجارب رقمية متكاملة
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: '1.8' }}>
                            أجمع بين الخبرة التقنية في التطوير والرؤية الاستراتيجية في التسويق لبناء منتجات ناجحة.
                        </p>
                    </div>

                    {/* Cards Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>

                        {/* Web Development Card */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#2563eb' }}>
                                <Code size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>تطوير الويب</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                مطور ويب متخصص في بناء تطبيقات حديثة وسريعة الاستجابة. أتقن بناء المواقع الكاملة من الواجهة الأمامية إلى الخلفية (Full Stack) لضمان أداء عالي وتجربة مستخدم سلسة.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• تطوير الواجهات (Frontend)</li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• تطوير الخوادم وقواعد البيانات (Backend)</li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• بناء وإدارة المتاجر الإلكترونية</li>
                            </ul>
                        </div>

                        {/* Product Marketing Card */}
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#16a34a' }}>
                                <TrendingUp size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>تسويق المنتجات</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                لا أكتفي ببناء المنتج، بل أساعد في إيصاله للجمهور المناسب. أستخدم استراتيجيات تسويقية حديثة لتحليل السوق، فهم العملاء، وزيادة النمو والمبيعات.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• استراتيجيات النمو (Growth)</li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• تحسين معدلات التحويل (CRO)</li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• إطلاق المنتجات الرقمية</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact/CTA Section */}
                    <div style={{ textAlign: 'center', background: '#1e293b', color: 'white', padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>لنعمل معاً</h2>
                        <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                            هل لديك فكرة مشروع؟ يمكنني مساعدتك في تحويلها إلى واقع تقني وتسويقها بنجاح.
                        </p>
                        <a href="mailto:contact@example.com" className="btn btn-primary" style={{ background: 'white', color: '#1e293b', border: 'none', padding: '0.8rem 2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={18} />
                            تواصل معي
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '2rem 0', marginTop: 'auto', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                <p>© 2026 جميع الحقوق محفوظة.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
