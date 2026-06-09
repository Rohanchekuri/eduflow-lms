import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function LearnPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/courses/${courseId}/content`);
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);
      } catch { setCourse(null); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [courseId]);

  if (!user) return <Navigate to="/login" />;
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 48, animation: 'pulse 1.5s infinite' }}>⟳</div>
    </div>
  );
  if (!course) return (
    <div style={{ paddingTop: 68, textAlign: 'center', padding: '120px 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
      <h2 style={{ marginBottom: 12 }}>Access Denied</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You need to enroll in this course first.</p>
      <Link to={`/courses/${courseId}`} className="btn btn-primary">Enroll Now</Link>
    </div>
  );

  const currentModule = course.modules?.[activeModule];
  const currentLesson = currentModule?.lessons?.[activeLesson];
  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;
  const completedCount = enrollment?.progress?.filter(p => p.completed)?.length || 0;
  const overallProgress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isLessonCompleted = (lessonId) => {
    return enrollment?.progress?.some(p => p.lessonId?.toString() === lessonId?.toString() && p.completed);
  };

  const markComplete = async () => {
    if (!currentLesson) return;
    try {
      const res = await API.post('/enrollments/progress', {
        courseId, moduleId: currentModule._id, lessonId: currentLesson._id, completed: true
      });
      setEnrollment(prev => ({ ...prev, progress: res.data.progress, progressPercentage: res.data.progressPercentage }));
    } catch {}
  };

  const navigateLesson = (direction) => {
    const lessons = currentModule?.lessons || [];
    if (direction === 'next') {
      if (activeLesson < lessons.length - 1) setActiveLesson(activeLesson + 1);
      else if (activeModule < course.modules.length - 1) { setActiveModule(activeModule + 1); setActiveLesson(0); }
    } else {
      if (activeLesson > 0) setActiveLesson(activeLesson - 1);
      else if (activeModule > 0) { setActiveModule(activeModule - 1); setActiveLesson((course.modules[activeModule-1]?.lessons?.length||1)-1); }
    }
  };

  return (
    <div style={{ paddingTop: 68, display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 320 : 0, minWidth: sidebarOpen ? 320 : 0,
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
        overflow: 'hidden', transition: 'width 0.3s ease, min-width 0.3s ease',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <h3 style={{ fontSize: 14, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>{course.title}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            <span>{overallProgress}% complete</span>
            <span>{completedCount}/{totalLessons}</span>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {course.modules?.map((mod, mi) => (
            <div key={mod._id || mi}>
              <div style={{
                padding: '14px 20px', background: mi === activeModule ? 'rgba(124,58,237,0.1)' : 'transparent',
                borderBottom: '1px solid var(--border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10
              }} onClick={() => setActiveModule(mi)}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: mi === activeModule ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: mi === activeModule ? 'white' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)'
                }}>{mi+1}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: mi === activeModule ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.3 }}>{mod.title}</span>
              </div>

              {mi === activeModule && mod.lessons?.map((lesson, li) => {
                const done = isLessonCompleted(lesson._id);
                const active = li === activeLesson;
                return (
                  <div key={lesson._id || li} onClick={() => setActiveLesson(li)} style={{
                    padding: '12px 20px 12px 56px', cursor: 'pointer',
                    background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                    borderLeft: active ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 10, transition: 'var(--transition)'
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: done ? 'var(--accent-emerald)' : active ? 'var(--accent-primary)' : 'transparent',
                      border: done || active ? 'none' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'white'
                    }}>{done ? '✓' : active ? '▶' : ''}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</div>
                      {lesson.duration && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{lesson.duration} min</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-secondary)', flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 20, padding: 4 }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{currentModule?.title}</span>
          <span style={{ color: 'var(--border)' }}>›</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{currentLesson?.title}</span>
        </div>

        {/* Video area */}
        <div style={{ background: '#000', paddingTop: '56.25%', position: 'relative', flexShrink: 0, maxHeight: 480 }}>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(124,58,237,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, cursor: 'pointer', transition: 'transform 0.2s'
            }}>▶</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              {currentLesson?.title || 'Select a lesson'}
            </p>
            {currentLesson?.videoUrl && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Video URL: {currentLesson.videoUrl}</p>
            )}
          </div>
        </div>

        {/* Lesson content */}
        <div style={{ padding: 32, flex: 1 }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>{currentLesson?.title || 'Welcome to the course!'}</h2>
                {currentLesson?.duration && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>🕐 {currentLesson.duration} minutes</p>}
              </div>
              <button onClick={markComplete} className="btn btn-primary btn-sm" disabled={isLessonCompleted(currentLesson?._id)}>
                {isLessonCompleted(currentLesson?._id) ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>

            {currentLesson?.description && (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>{currentLesson.description}</p>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => navigateLesson('prev')} className="btn btn-outline" disabled={activeModule === 0 && activeLesson === 0}>
                ← Previous Lesson
              </button>
              <button onClick={() => navigateLesson('next')} className="btn btn-primary"
                disabled={activeModule === (course.modules?.length || 1) - 1 && activeLesson === (currentModule?.lessons?.length || 1) - 1}>
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
