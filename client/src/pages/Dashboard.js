import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/enrollments/my').then(res => setEnrollments(res.data.enrollments || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" />;

  const completed = enrollments.filter(e => e.progressPercentage === 100).length;
  const inProgress = enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length;

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'white', flexShrink: 0
            }}>{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Welcome back, {user.name?.split(' ')[0]}!</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Continue your learning journey</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, marginTop: 40 }}>
            {[
              { label: 'Enrolled Courses', value: enrollments.length, icon: '📚' },
              { label: 'In Progress', value: inProgress, icon: '▶' },
              { label: 'Completed', value: completed, icon: '🏆' },
              { label: 'Certificates', value: completed, icon: '🎓' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px',
                display: 'flex', alignItems: 'center', gap: 16
              }}>
                <span style={{ fontSize: 28 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ fontSize: 24 }}>My Courses</h2>
          <Link to="/courses" className="btn btn-outline btn-sm">Browse More →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ borderRadius: 16, border: '1px solid var(--border)', padding: 20 }}>
                <div className="skeleton" style={{ height: 14, marginBottom: 10, width: '60%' }} />
                <div className="skeleton" style={{ height: 20, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 8, borderRadius: 100 }} />
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            border: '2px dashed var(--border)', borderRadius: 24, color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>No courses yet</h3>
            <p style={{ marginBottom: 28 }}>Enroll in a course to start your learning journey</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {enrollments.map(enrollment => {
              const course = enrollment.course;
              if (!course) return null;
              const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;
              const progress = enrollment.progressPercentage || 0;

              return (
                <Link key={enrollment._id} to={`/learn/${course._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 20, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {course.category}
                        </span>
                        {progress === 100 && <span className="badge badge-emerald">✓ Completed</span>}
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>by {course.instructor}</p>

                      {/* Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                          <span>{progress}% complete</span>
                          <span>{Math.round((progress/100)*totalLessons)}/{totalLessons} lessons</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {progress === 0 ? 'Start learning' : progress === 100 ? 'Review course' : 'Continue learning'}
                      </span>
                      <span style={{ color: 'var(--accent-secondary)', fontSize: 16 }}>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
