import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import styles from './Auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { login, loading } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'فشل تسجيل الدخول');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader} style={{ position: 'relative' }}>
                    <Link
                        to="/"
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none'
                        }}
                    >
                        الرئيسية <ArrowLeft size={16} />
                    </Link>
                    <h1>مرحباً بعودتك</h1>
                    <p>سجل دخولك للمتابعة إلى لوحة التحكم</p>
                </div>
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.inputGroup}>
                        <label>البريد الإلكتروني</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={20} className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>كلمة المرور</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formFooter}>
                        <Link to="/forgot-password" className={styles.forgotPass}>
                            نسيت كلمة المرور؟
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        تسجيل الدخول
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>ليس لديك حساب؟ <Link to="/signup">أنشئ حساباً جديداً</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
