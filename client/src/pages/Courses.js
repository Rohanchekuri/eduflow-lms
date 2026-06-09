import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import CourseCard from '../components/CourseCard';

const CATEGORIES = ['All', 'Web Development', 'Backend Development', 'Data Science', 'Design', 'Cloud Computing', 'Mobile Development'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (level && level !== 'All') params.append('level', level);
      const res = await API.get(`/courses?${params}`);
      setCourses(res.data.courses || []);
      setTotal(res.data.total || 0);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  }, [search, category, level, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === 'price-low') return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
    if (sortBy === 'price-high') return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'popular') return (b.totalStudents || 0) - (a.totalStudents || 0);
    return 0;
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div className="container">
          <p className="section-eyebrow" style={{ marginBottom: 8 }}>All Courses</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 16 }}>Expand Your Skills</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 600 }}>
            Browse our library of expert-crafted courses across technology, design, and more.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }}>
          {/* SIDEBAR */}
          <aside style={{ position: 'sticky', top: 88 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, color: 'var(--text-primary)' }}>Filters</h3>

              {/* Search */}
              <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
                <label className="form-label">Search</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Course name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, fontSize: 14, padding: '10px 12px' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>🔍</button>
                </div>
              </form>

              {/* Category */}
              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Category</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }} style={{
                      padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontSize: 14, fontFamily: 'var(--font-body)', transition: 'var(--transition)',
                      background: (category === cat || (cat === 'All' && !category)) ? 'rgba(124,58,237,0.2)' : 'transparent',
                      color: (category === cat || (cat === 'All' && !category)) ? 'var(--accent-tertiary)' : 'var(--text-secondary)'
                    }}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="form-label">Level</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {LEVELS.map(lvl => (
                    <button key={lvl} onClick={() => { setLevel(lvl === 'All' ? '' : lvl); setPage(1); }} style={{
                      padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontSize: 14, fontFamily: 'var(--font-body)', transition: 'var(--transition)',
                      background: (level === lvl || (lvl === 'All' && !level)) ? 'rgba(124,58,237,0.2)' : 'transparent',
                      color: (level === lvl || (lvl === 'All' && !level)) ? 'var(--accent-tertiary)' : 'var(--text-secondary)'
                    }}>{lvl}</button>
                  ))}
                </div>
              </div>

              {(search || category || level) && (
                <button onClick={() => { setSearch(''); setCategory(''); setLevel(''); setPage(1); }} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 16 }}>
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* COURSES GRID */}
          <div>
            {/* Sort & Count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {loading ? 'Loading...' : `${total} course${total !== 1 ? 's' : ''} found`}
              </p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', padding: '8px 12px', fontSize: 14 }}>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: 170 }} />
                    <div style={{ padding: 18 }}>
                      <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '40%' }} />
                      <div className="skeleton" style={{ height: 18, marginBottom: 16 }} />
                      <div className="skeleton" style={{ height: 24, width: '45%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedCourses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {sortedCourses.map(course => <CourseCard key={course._id} course={course} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <h3 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>No courses found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
