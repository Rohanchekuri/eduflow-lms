import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleProfile = async (e) => {
    e.preventDefault(); setMsg(''); setErr(''); setLoading(true);
    try {
      const res = await API.put('/users/profile', { name: form.name, avatar: form.avatar });
      const updated = res.data.user;
      localStorage.setItem('user', JSON.stringify({ ...user, ...updated }));
      setUser(prev => ({ ...prev, ...updated }));
      setMsg('✓ Profile updated successfully!');
    } catch (e) { setErr(e.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setMsg(''); setErr('');
    if (pwForm.newPassword !== pwForm.confirm) { setErr('Passwords do not match'); return; }
    setLoading(true);
    try {
      await API.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setMsg('✓ Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) { setErr(e.response?.data?.message || 'Password change failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div className="container">
          <h1 style={{ fontSize: 28 }}>👤 My Profile</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your account settings</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px', maxWidth: 720 }}>
        {msg && <div className="alert alert-success" style={{ marginBottom: 24 }}>{msg}</div>}
        {err && <div className="alert alert-error" style={{ marginBottom: 24 }}>⚠️ {err}</div>}

        {/* Profile Info */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'white', flexShrink: 0 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: 20 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</p>
              <span className={`badge ${user.role === 'admin' ? 'badge-gold' : 'badge-purple'}`} style={{ marginTop: 6 }}>{user.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email (cannot change)</label>
              <input value={user.email} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} placeholder="https://..." />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        {/* Password */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, marginBottom: 24 }}>🔐 Change Password</h3>
          <form onSubmit={handlePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">{loading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
