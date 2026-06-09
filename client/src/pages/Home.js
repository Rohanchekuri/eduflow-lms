import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import CourseCard from '../components/CourseCard';

const STATS = [
  { value: '50,000+', label: 'Students Enrolled' },
  { value: '200+', label: 'Expert Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Learning Access' },
];

const CATEGORIES = [
  { icon: '🌐', name: 'Web Development', count: 45 },
  { icon: '🤖', name: 'Data Science', count: 32 },
  { icon: '🎨', name: 'Design', count: 28 },
  { icon: '☁️', name: 'Cloud Computing', count: 19 },
  { icon: '📱', name: 'Mobile Dev', count: 23 },
  { icon: '🔐', name: 'Cybersecurity', count: 15 },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Full Stack Dev at Swiggy', text: 'EduFlow transformed my career. The React course was exceptional — practical, deep, and worth every rupee.', rating: 5 },
  { name: 'Priya Nair', role: 'Data Scientist at TCS', text: 'The ML course content is top-notch. I landed my dream job within 3 months of completing it!', rating: 5 },
  { name: 'Rahul Gupta', role: 'Cloud Architect at Infosys', text: 'Best investment I ever made. The AWS course helped me clear my certification on the first attempt.', rating: 5 },
];

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/courses?limit=6').then(res => {
      setFeaturedCourses(res.data.courses || []);
    }).catch(() => setFeaturedCourses([])).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="page-wrapper">
      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 100
      }}>
        <div className="mesh-bg" />
        <div className="stars" />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 24px' }}>
          <div className="animate-fade-up" style={{ marginBottom: 24 }}>
            <span className="badge badge-purple" style={{ fontSize: 13, padding: '6px 14px' }}>
              ✦ India's Premier Learning Platform
            </span>
          </div>

          <h1 className="animate-fade-up delay-1" style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 800,
            lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.02em'
          }}>
            Learn Without{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Limits</span>
          </h1>

          <p className="animate-fade-up delay-2" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--text-secondary)',
            maxWidth: 680, margin: '0 auto 48px', lineHeight: 1.7
          }}>
            Master in-demand skills with expert-led courses. From web development to data science — 
            your future starts here.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="animate-fade-up delay-3" style={{
            display: 'flex', gap: 12, maxWidth: 540, margin: '0 auto 48px',
            background: 'rgba(124,58,237,0.1)', border: '1px solid var(--border-hover)',
            borderRadius: 100, padding: '6px 6px 6px 24px'
          }}>
            <input
              type="text"
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 15, padding: 0, width: 'auto'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 100, padding: '10px 24px', flexShrink: 0 }}>
              Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">Explore Courses →</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Start for Free</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
            marginTop: 80, maxWidth: 700, margin: '80px auto 0'
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} className={`animate-fade-up delay-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="section-eyebrow">Browse by Topic</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>Explore Categories</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Choose from our wide range of technology and design courses
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/courses?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '28px 20px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.count} courses</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-eyebrow">Top Picks</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Featured Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline">View All Courses →</Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div style={{ padding: 18 }}>
                    <div className="skeleton" style={{ height: 14, marginBottom: 10, width: '40%' }} />
                    <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, marginBottom: 16, width: '80%' }} />
                    <div className="skeleton" style={{ height: 28, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCourses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {featuredCourses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <p>No courses available yet. <Link to="/admin" style={{ color: 'var(--accent-secondary)' }}>Add some courses</Link> to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="section-eyebrow">Student Success</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>What Our Students Say</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: 'var(--accent-gold)', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'white'
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Ready to Level Up?
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Join thousands of learners building their future with EduFlow.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Learning Today</Link>
            <Link to="/courses" className="btn btn-outline btn-lg">Browse Courses</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
