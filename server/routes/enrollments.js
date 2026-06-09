const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// Get my enrollments
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id, paymentStatus: 'completed' })
      .populate('course', 'title thumbnail instructor category level modules')
      .sort({ enrolledAt: -1 });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark lesson complete
router.post('/progress', protect, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId, completed } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId, paymentStatus: 'completed' });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled' });

    const existing = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
    if (existing) {
      existing.completed = completed;
      if (completed) existing.completedAt = new Date();
    } else {
      enrollment.progress.push({ lessonId, moduleId, completed, completedAt: completed ? new Date() : undefined });
    }

    // Calculate total lessons
    const course = await Course.findById(courseId);
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    enrollment.calculateProgress(totalLessons);
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progressPercentage === 100) enrollment.completedAt = new Date();
    await enrollment.save();

    res.json({ success: true, progress: enrollment.progress, progressPercentage: enrollment.progressPercentage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
