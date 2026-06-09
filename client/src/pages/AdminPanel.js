import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const TABS = ['Dashboard', 'Courses', 'Users', 'Enrollments'];

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [msg, setMsg] = useState('');

  const emptyForm = { title:'', description:'', instructor:'', price:'', discountedPrice:'', category:'Web Development', level:'Beginner', tags:'', thumbnail:'' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (tab === 'Dashboard') fetchStats();
    if (tab === 'Courses') fetchCourses();
    if (tab === 'Users') fetchUsers();
    if (tab === 'Enrollments') fetchEnrollments();
  }, [tab]);

  const fetchStats = async () => { try { const r = await API.get('/admin/stats'); setStats(r.data.stats); } catch {} };
  const fetchCourses = async () => { setLoading(true); try { const r = await API.get('/admin/courses'); setCourses(r.data.courses||[]); } catch {} finally { setLoading(false); } };
  const fetchUsers = async () => { setLoading(true); try { const r = await API.get('/admin/users'); setUsers(r.data.users||[]); } catch {} finally { setLoading(false); } };
  const fetchEnrollments = async () => { setLoading(true); try { const r = await API.get('/admin/enrollments'); setEnrollments(r.data.enrollments||[]); } catch {} finally { setLoading(false); } };

  const seedData = async () => {
    setLoading(true);
    try { await API.post('/admin/seed'); setMsg('✓ Demo courses seeded!'); fetchCourses(); setTab('Courses'); }
    catch (e) { setMsg('Error: ' + e.response?.data?.message); }
    finally { setLoading(false); }
  };

  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      if (editingCourse) { await API.put(`/admin/courses/${editingCourse._id}`, payload); setMsg('✓ Course updated!'); }
      else { await API.post('/admin/courses', payload); setMsg('✓ Course created!'); }
      setShowCourseForm(false); setEditingCourse(null); setForm(emptyForm); fetchCourses();
    } catch (e) { setMsg('Error: ' + e.response?.data?.message); }
    finally { setLoading(false); }
  };

  const handleEditCourse = (c) => {
    setForm({ title:c.title, description:c.description, instructor:c.instructor, price:c.price, discountedPrice:c.discountedPrice||'', category:c.category, level:c.level, tags:(c.tags||[]).join(', '), thumbnail:c.thumbnail||'' });
    setEditingCourse(c); setShowCourseForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await API.delete(`/admin/courses/${id}`); setMsg('✓ Course deleted'); fetchCourses(); } catch {}
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div className="container">
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>⚙️ Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage courses, users, and enrollments</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {msg && <div className={`alert ${msg.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }} onClick={() => setMsg('')}>{msg}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, transition: 'var(--transition)',
              background: tab === t ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-muted)'
            }}>{t}</button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'Dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
              {[
                { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: '👥', color: '#7c3aed' },
                { label: 'Total Courses', value: stats?.totalCourses ?? '—', icon: '📚', color: '#f59e0b' },
                { label: 'Enrollments', value: stats?.totalEnrollments ?? '—', icon: '🎓', color: '#10b981' },
                { label: 'Revenue', value: stats?.revenue ? `₹${stats.revenue.toLocaleString()}` : '—', icon: '💰', color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={seedData} disabled={loading} className="btn btn-primary">
              {loading ? 'Seeding...' : '🌱 Seed Demo Courses'}
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Populate database with sample course data for testing</p>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === 'Courses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
              <h2 style={{ fontSize: 20 }}>Courses ({courses.length})</h2>
              <button onClick={() => { setShowCourseForm(true); setEditingCourse(null); setForm(emptyForm); }} className="btn btn-primary btn-sm">+ Add Course</button>
            </div>

            {showCourseForm && (
              <div className="card" style={{ padding: 28, marginBottom: 28 }}>
                <h3 style={{ marginBottom: 20 }}>{editingCourse ? 'Edit Course' : 'New Course'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['title','Title'],['instructor','Instructor'],['price','Price (₹)'],['discountedPrice','Discounted Price (₹)'],['thumbnail','Thumbnail URL'],['tags','Tags (comma-separated)']].map(([k,l]) => (
                    <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">{l}</label>
                      <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={l} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                      {['Web Development','Backend Development','Data Science','Design','Cloud Computing','Mobile Development'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Level</label>
                    <select value={form.level} onChange={e => setForm({...form,level:e.target.value})}>
                      {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={3} placeholder="Course description..." />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={handleSaveCourse} disabled={loading} className="btn btn-primary btn-sm">{loading ? 'Saving...' : 'Save Course'}</button>
                  <button onClick={() => { setShowCourseForm(false); setEditingCourse(null); }} className="btn btn-outline btn-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Price</th><th>Students</th><th>Actions</th></tr></thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
                    ) : courses.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No courses. Add one or seed demo data.</td></tr>
                    ) : courses.map(c => (
                      <tr key={c._id}>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: 240 }}>{c.title}</td>
                        <td><span className="badge badge-purple" style={{ fontSize: 11 }}>{c.category}</span></td>
                        <td>{c.level}</td>
                        <td style={{ color: 'var(--accent-gold)' }}>₹{(c.discountedPrice||c.price)?.toLocaleString()}</td>
                        <td>{c.totalStudents || 0}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleEditCourse(c)} className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>Edit</button>
                            <button onClick={() => handleDeleteCourse(c._id)} className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'Users' && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 24 }}>Users ({users.length})</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading...</td></tr>
                    : users.map(u => (
                      <tr key={u._id}>
                        <td style={{ color:'var(--text-primary)', fontWeight:500 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role==='admin'?'badge-gold':'badge-purple'}`}>{u.role}</span></td>
                        <td><span className={`badge ${u.isVerified?'badge-emerald':'badge-blue'}`}>{u.isVerified?'✓ Verified':'Pending'}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ENROLLMENTS TAB */}
        {tab === 'Enrollments' && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 24 }}>Enrollments ({enrollments.length})</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading...</td></tr>
                    : enrollments.map(e => (
                      <tr key={e._id}>
                        <td style={{ color:'var(--text-primary)' }}>{e.user?.name || 'N/A'}<br/><span style={{fontSize:12,color:'var(--text-muted)'}}>{e.user?.email}</span></td>
                        <td>{e.course?.title || 'N/A'}</td>
                        <td style={{ color:'var(--accent-gold)' }}>₹{e.amount?.toLocaleString()}</td>
                        <td><span className={`badge ${e.paymentStatus==='completed'?'badge-emerald':e.paymentStatus==='pending'?'badge-gold':'badge-blue'}`}>{e.paymentStatus}</span></td>
                        <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
