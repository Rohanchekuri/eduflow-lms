import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import { Login, Register, ForgotPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import LearnPage from './pages/LearnPage';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Profile from './pages/Profile';
import './index.css';

const NO_FOOTER = ['/learn'];

function Layout() {
  const location = useLocation();
  const hideFooter = NO_FOOTER.some(p => location.pathname.startsWith(p));
  const isLearnPage = location.pathname.startsWith('/learn');

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learn/:courseId" element={<LearnPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '160px 24px', paddingTop: 'calc(160px + 68px)' }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>404</div>
              <h2 style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>Page not found</h2>
              <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="page-wrapper noise">
          <Layout />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
