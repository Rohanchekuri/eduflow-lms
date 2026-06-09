import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', position: 'relative' }}>
      <div className="mesh-bg" />
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white' }}>E</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>EduFlow</span>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{subtitle}</p>
        </div>
        <div className="card" style={{ padding: 36 }}>{children}</div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Password
            <Link to="/forgot-password" style={{ color: 'var(--accent-secondary)', fontSize: 13 }}>Forgot password?</Link>
          </label>
          <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
      <div style={{ marginTop: 20, padding: 14, background: 'rgba(124,58,237,0.1)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Demo Admin:</strong> admin@eduflow.com / admin123
      </div>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      setSuccess(data.message || 'Registered! Check your email to verify.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start your learning journey today">
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
      {success && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ {success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="At least 6 characters" />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      const API = (await import('../utils/api')).default;
      await API.post('/auth/forgot-password', { email });
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending email');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link">
      {message && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ {message}</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/login" style={{ color: 'var(--accent-secondary)', fontSize: 14 }}>← Back to Login</Link>
      </div>
    </AuthLayout>
  );
}
