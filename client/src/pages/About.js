const TEAM = [
  { name: 'Sarah Johnson', role: 'Head of Curriculum', emoji: '👩‍💻' },
  { name: 'Mike Chen', role: 'Lead Instructor', emoji: '👨‍🏫' },
  { name: 'Dr. Priya Sharma', role: 'Data Science Lead', emoji: '👩‍🔬' },
  { name: 'Alex Kumar', role: 'Platform Engineer', emoji: '👨‍💻' },
];

export default function About() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div className="mesh-bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <p className="section-eyebrow">Our Story</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 20 }}>Built for Learners,<br />by Learners</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            EduFlow was founded with one mission: make world-class tech education accessible to everyone in India and beyond.
          </p>
        </div>
      </div>

      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { icon: '🎯', title: 'Our Mission', text: 'To democratize quality tech education and empower every learner to build the future they deserve — regardless of their background or location.' },
              { icon: '🌟', title: 'Our Vision', text: 'A world where skills, not certificates, define opportunity. We believe in learning by doing, mentorship, and building real projects.' },
              { icon: '💡', title: 'Our Approach', text: 'Project-based learning, industry-aligned curriculum, expert instructors, and a community that lifts each other up.' },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-eyebrow">The Team</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Meet Our Experts</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>{m.emoji}</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>{m.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>Ready to Join?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 18 }}>Start your learning journey today — your first course is waiting.</p>
          <a href="/register" className="btn btn-primary btn-lg">Get Started Free →</a>
        </div>
      </section>
    </div>
  );
}
