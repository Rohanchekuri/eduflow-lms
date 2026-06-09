import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,7,24,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.15)',
      padding: '0 24px', height: '68px',
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)'
          }}>E</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Edu<span style={{ color: 'var(--accent-secondary)' }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, display: 'none' }} className="desktop-nav">
          {[['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding: '8px 16px', borderRadius: 8,
              color: isActive(path) ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14,
              background: isActive(path) ? 'rgba(124,58,237,0.15)' : 'transparent',
              transition: 'var(--transition)'
            }}>{label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 100, padding: '6px 16px 6px 8px', cursor: 'pointer', color: 'var(--text-primary)'
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0
                }}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 8, minWidth: 200,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, animation: 'fadeIn 0.2s ease'
                }}>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} style={dropdownItemStyle}>⚙️ Admin Panel</Link>
                  )}
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} style={dropdownItemStyle}>📚 My Dashboard</Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} style={dropdownItemStyle}>👤 Profile</Link>
                  <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                  <button onClick={handleLogout} style={{ ...dropdownItemStyle, width: '100%', textAlign: 'left', color: '#f87171', cursor: 'pointer' }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ fontFamily: 'var(--font-display)' }}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'transparent', border: 'none', color: 'var(--text-primary)',
            fontSize: 22, display: 'none', cursor: 'pointer'
          }} className="mobile-menu-btn">{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {[['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About']].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
              padding: '12px 16px', borderRadius: 8, color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500
            }}>{label}</Link>
          ))}
          {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding: '12px 16px', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: 15 }}>My Dashboard</Link>}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .desktop-nav { display: flex !important; } }
        @media (max-width: 767px) { .mobile-menu-btn { display: block !important; } }
      `}</style>
    </nav>
  );
}

const dropdownItemStyle = {
  display: 'block', padding: '10px 14px', borderRadius: 8,
  color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-display)',
  fontWeight: 500, background: 'transparent', border: 'none',
  transition: 'var(--transition)', cursor: 'pointer', textDecoration: 'none'
};
