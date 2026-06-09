import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '60px 24px 32px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white' }}>E</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>EduFlow</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
              Premium online learning platform for modern developers and designers.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'var(--text-secondary)', fontSize: 14, transition: 'color 0.2s' }}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>Account</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/login', 'Sign In'], ['/register', 'Get Started'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Web Development', 'Data Science', 'Design', 'Cloud Computing', 'Mobile'].map(cat => (
                <Link key={cat} to={`/courses?category=${encodeURIComponent(cat)}`} style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{cat}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>© 2024 EduFlow. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Built with React · Node.js · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
