import { Link } from 'react-router-dom';

const levelColors = {
  Beginner: 'badge-emerald',
  Intermediate: 'badge-gold',
  Advanced: 'badge-blue'
};

export default function CourseCard({ course, enrolled }) {
  const price = course.discountedPrice || course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        {/* Thumbnail */}
        <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }} />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card-hover))', fontSize: 48
            }}>📚</div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)'
          }} />
          {enrolled && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'var(--accent-emerald)', color: 'white',
              padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
              fontFamily: 'var(--font-display)'
            }}>✓ Enrolled</div>
          )}
          <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span className={`badge ${levelColors[course.level] || 'badge-purple'}`}>{course.level}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            {course.category}
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>👤 {course.instructor}</span>
            <span>📖 {totalLessons} lessons</span>
            <span>⭐ {course.rating?.toFixed(1) || '4.5'}</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
                ₹{price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{course.price.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-display)' }}>
                {Math.round((1 - price/course.price)*100)}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
