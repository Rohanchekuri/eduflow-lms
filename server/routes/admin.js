const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// Dashboard stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, revenue] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Course.countDocuments(),
      Enrollment.countDocuments({ paymentStatus: 'completed' }),
      Enrollment.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    res.json({ success: true, stats: { totalUsers, totalCourses, totalEnrollments, revenue: revenue[0]?.total || 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create course
router.post('/courses', adminOnly, async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update course
router.put('/courses/:id', adminOnly, async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete course
router.delete('/courses/:id', adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all courses (admin)
router.get('/courses', adminOnly, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all enrollments
router.get('/enrollments', adminOnly, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ enrolledAt: -1 });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed demo data
router.post('/seed', adminOnly, async (req, res) => {
  try {
    await Course.deleteMany({});
    const courses = await Course.insertMany([
      {
        title: 'Complete React Development Bootcamp',
        description: 'Master React.js from scratch. Build real projects, learn hooks, context, Redux, and deploy production apps.',
        instructor: 'Sarah Johnson',
        price: 3999,
        discountedPrice: 999,
        category: 'Web Development',
        level: 'Beginner',
        tags: ['React', 'JavaScript', 'Frontend'],
        totalStudents: 1247,
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        modules: [
          {
            title: 'Getting Started with React',
            order: 1,
            lessons: [
              { title: 'Introduction to React', duration: 15, order: 1, isFree: true, videoUrl: 'https://example.com/video1' },
              { title: 'JSX and Components', duration: 20, order: 2, videoUrl: 'https://example.com/video2' },
              { title: 'Props and State', duration: 25, order: 3, videoUrl: 'https://example.com/video3' }
            ]
          },
          {
            title: 'React Hooks Deep Dive',
            order: 2,
            lessons: [
              { title: 'useState Hook', duration: 18, order: 1, videoUrl: 'https://example.com/video4' },
              { title: 'useEffect Hook', duration: 22, order: 2, videoUrl: 'https://example.com/video5' },
              { title: 'Custom Hooks', duration: 30, order: 3, videoUrl: 'https://example.com/video6' }
            ]
          }
        ]
      },
      {
        title: 'Node.js & Express Backend Mastery',
        description: 'Build scalable backend applications with Node.js, Express, MongoDB, and REST APIs.',
        instructor: 'Mike Chen',
        price: 4999,
        discountedPrice: 1499,
        category: 'Backend Development',
        level: 'Intermediate',
        tags: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        totalStudents: 892,
        rating: 4.7,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        modules: [
          {
            title: 'Node.js Fundamentals',
            order: 1,
            lessons: [
              { title: 'Node.js Architecture', duration: 20, order: 1, isFree: true, videoUrl: 'https://example.com/video7' },
              { title: 'Modules and NPM', duration: 25, order: 2, videoUrl: 'https://example.com/video8' }
            ]
          },
          {
            title: 'Building APIs with Express',
            order: 2,
            lessons: [
              { title: 'Express Routing', duration: 22, order: 1, videoUrl: 'https://example.com/video9' },
              { title: 'Middleware', duration: 18, order: 2, videoUrl: 'https://example.com/video10' },
              { title: 'Error Handling', duration: 15, order: 3, videoUrl: 'https://example.com/video11' }
            ]
          }
        ]
      },
      {
        title: 'Machine Learning with Python',
        description: 'Learn ML from fundamentals to deployment. Covers scikit-learn, TensorFlow, and real-world projects.',
        instructor: 'Dr. Priya Sharma',
        price: 5999,
        discountedPrice: 1999,
        category: 'Data Science',
        level: 'Advanced',
        tags: ['Python', 'Machine Learning', 'TensorFlow', 'AI'],
        totalStudents: 634,
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        modules: [
          {
            title: 'ML Fundamentals',
            order: 1,
            lessons: [
              { title: 'What is Machine Learning?', duration: 12, order: 1, isFree: true, videoUrl: 'https://example.com/video12' },
              { title: 'Python for ML', duration: 35, order: 2, videoUrl: 'https://example.com/video13' },
              { title: 'NumPy & Pandas', duration: 40, order: 3, videoUrl: 'https://example.com/video14' }
            ]
          }
        ]
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Design beautiful, user-centered interfaces using Figma. Learn design systems, prototyping, and usability.',
        instructor: 'Emma Rodriguez',
        price: 2999,
        discountedPrice: 799,
        category: 'Design',
        level: 'Beginner',
        tags: ['UI/UX', 'Figma', 'Design', 'Prototyping'],
        totalStudents: 1583,
        rating: 4.6,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        modules: [
          {
            title: 'Design Principles',
            order: 1,
            lessons: [
              { title: 'Color Theory', duration: 18, order: 1, isFree: true, videoUrl: 'https://example.com/video15' },
              { title: 'Typography', duration: 20, order: 2, videoUrl: 'https://example.com/video16' }
            ]
          }
        ]
      },
      {
        title: 'AWS Cloud Practitioner',
        description: 'Prepare for AWS Cloud Practitioner certification. Covers EC2, S3, Lambda, RDS, and core cloud concepts.',
        instructor: 'James Wilson',
        price: 3499,
        discountedPrice: 1199,
        category: 'Cloud Computing',
        level: 'Beginner',
        tags: ['AWS', 'Cloud', 'DevOps'],
        totalStudents: 445,
        rating: 4.5,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        modules: [
          {
            title: 'AWS Fundamentals',
            order: 1,
            lessons: [
              { title: 'Introduction to AWS', duration: 15, order: 1, isFree: true, videoUrl: 'https://example.com/video17' },
              { title: 'IAM & Security', duration: 25, order: 2, videoUrl: 'https://example.com/video18' }
            ]
          }
        ]
      },
      {
        title: 'Flutter Mobile App Development',
        description: 'Build cross-platform mobile apps for iOS and Android using Flutter and Dart.',
        instructor: 'Alex Kumar',
        price: 4499,
        discountedPrice: 1299,
        category: 'Mobile Development',
        level: 'Intermediate',
        tags: ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android'],
        totalStudents: 728,
        rating: 4.7,
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        modules: [
          {
            title: 'Dart Language Basics',
            order: 1,
            lessons: [
              { title: 'Dart Syntax', duration: 20, order: 1, isFree: true, videoUrl: 'https://example.com/video19' },
              { title: 'OOP in Dart', duration: 28, order: 2, videoUrl: 'https://example.com/video20' }
            ]
          }
        ]
      }
    ]);
    res.json({ success: true, message: `Seeded ${courses.length} courses`, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
