const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, level, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .select('-modules.lessons.videoUrl')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, total, page: Number(page), courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get enrolled course content
router.get('/:id/content', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id, paymentStatus: 'completed' });
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
