import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import styles from './Auth.module.css';
import API_URL from '../../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/forgotpassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'تم إرسال رابط استعادة كلمة المرور لبريدك الإلكتروني');
            } else {
                setError(data.message || 'حدث خطأ ما');
            }
        } catch (err) {
            setError('فشل الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader} style={{ position: 'relative' }}>
                    <Link
                        to="/login"
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
                        رجوع <ArrowLeft size={16} />
                    </Link>
                    <h1>نسيت كلمة المرور</h1>
                    <p>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</p>
                </div>

                {message && <div style={{ color: '#166534', background: '#dcfce7', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                {error && <div style={{ color: '#991b1b', background: '#fee2e2', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.inputGroup}>
                        <label>البريد الإلكتروني</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={20} className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
