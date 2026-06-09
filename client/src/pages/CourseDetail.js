import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [openModule, setOpenModule] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data.course);
        if (user) {
          try {
            const enrollRes = await API.get('/enrollments/my');
            const isEnrolled = enrollRes.data.enrollments?.some(e => e.course?._id === id);
            setEnrolled(isEnrolled);
          } catch {}
        }
      } catch { navigate('/courses'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true); setError('');
    try {
      const orderRes = await API.post('/payments/create-order', { courseId: id });
      const { orderId, amount, demoMode } = orderRes.data;

      if (demoMode) {
        // Demo mode - simulate payment
        await API.post('/payments/verify', {
          razorpay_order_id: orderId,
          razorpay_payment_id: 'demo_' + Date.now(),
          courseId: id,
          demoMode: true
        });
        setEnrolled(true);
        alert('🎉 Enrolled successfully! (Demo Mode - Razorpay not configured)');
        return;
      }

      // Razorpay production mode
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount, currency: 'INR',
        name: 'EduFlow', description: course.title,
        order_id: orderId,
        handler: async (response) => {
          try {
            await API.post('/payments/verify', { ...response, courseId: id });
            setEnrolled(true);
            alert('🎉 Enrolled successfully!');
          } catch { setError('Payment verification failed'); }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#7c3aed' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return (
    <div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 48 }}>⟳</div>
    </div>
  );
  if (!course) return null;

  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;
  const price = course.discountedPrice || course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '60px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span className="badge badge-purple">{course.category}</span>
                <span className="badge badge-gold">{course.level}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20, lineHeight: 1.2 }}>{course.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.7, marginBottom: 28 }}>{course.description}</p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-muted)' }}>
                <span>👤 <strong style={{ color: 'var(--text-secondary)' }}>{course.instructor}</strong></span>
                <span>⭐ <strong style={{ color: 'var(--accent-gold)' }}>{course.rating?.toFixed(1) || '4.5'}</strong> ({course.totalRatings || 0} ratings)</span>
                <span>👥 {course.totalStudents?.toLocaleString() || 0} students</span>
                <span>📖 {totalLessons} lessons</span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div className="card" style={{ padding: 28 }}>
                {course.thumbnail && (
                  <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, paddingTop: '56.25%', position: 'relative' }}>
                    <img src={course.thumbnail} alt={course.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)' }}>₹{price.toLocaleString()}</span>
                  {hasDiscount && <span style={{ fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{course.price.toLocaleString()}</span>}
                </div>
                {hasDiscount && (
                  <p style={{ color: 'var(--accent-emerald)', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                    🎉 {Math.round((1 - price/course.price)*100)}% off — Limited time deal!
                  </p>
                )}

                {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

                {enrolled ? (
                  <div>
                    <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ You're enrolled in this course!</div>
                    <Link to={`/learn/${id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Continue Learning →
                    </Link>
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    {enrolling ? 'Processing...' : 'Enroll Now — Pay ₹' + price.toLocaleString()}
                  </button>
                )}

                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    This course includes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span>📱 Access on all devices</span>
                    <span>🏆 Certificate of completion</span>
                    <span>♾️ Full lifetime access</span>
                    <span>💬 Community support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 780 }}>
          <h2 style={{ fontSize: 28, marginBottom: 32 }}>Course Curriculum</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
            {course.modules?.length || 0} modules · {totalLessons} lessons total
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {course.modules?.map((mod, mi) => (
              <div key={mod._id || mi} className="card" style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpenModule(openModule === mi ? -1 : mi)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-display)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'white'
                    }}>{mi + 1}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{mod.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{mod.lessons?.length || 0} lessons</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', transform: openModule === mi ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                </button>

                {openModule === mi && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
                    {mod.lessons?.map((lesson, li) => (
                      <div key={lesson._id || li} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 20px', borderBottom: li < mod.lessons.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: lesson.isFree ? 'var(--accent-emerald)' : 'var(--text-muted)', fontSize: 16 }}>
                            {lesson.isFree ? '▶' : '🔒'}
                          </span>
                          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{lesson.title}</span>
                          {lesson.isFree && <span className="badge badge-emerald" style={{ fontSize: 10, padding: '2px 8px' }}>Free Preview</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{lesson.duration || 0} min</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
