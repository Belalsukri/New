import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import styles from './Auth.module.css';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // Assuming there's a way to set user, but usually we just navigate to login
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError('كلمات المرور غير متطابقة');
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage('تم إعادة تعيين كلمة المرور بنجاح. سيتم تحويلك إلى صفحة تسجيل الدخول...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'حدث خطأ ما أو أن الرابط منتهي الصلاحية');
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
                    <h1>تعيين كلمة مرور جديدة</h1>
                    <p>الرجاء إدخال كلمة المرور الجديدة أدناه (8 أحرف على الأقل، تتضمن حرفاً كبيراً وصغيراً ورقماً)</p>
                </div>

                {message && <div style={{ color: '#166534', background: '#dcfce7', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                {error && <div style={{ color: '#991b1b', background: '#fee2e2', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.inputGroup}>
                        <label>كلمة المرور الجديدة</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                                title="يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير، حرف صغير، ورقم."
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>تأكيد كلمة المرور</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
