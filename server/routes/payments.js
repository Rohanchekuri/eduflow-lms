const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEnrollmentEmail } = require('../utils/email');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id, course: courseId, paymentStatus: 'completed'
    });
    if (existingEnrollment) return res.status(400).json({ success: false, message: 'Already enrolled' });

    const amount = (course.discountedPrice || course.price) * 100; // in paise

    // For demo/test mode - create mock order if Razorpay not configured
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_id') {
      return res.json({
        success: true,
        orderId: 'order_demo_' + Date.now(),
        amount,
        currency: 'INR',
        courseName: course.title,
        demoMode: true
      });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${courseId}_${Date.now()}`
    });

    res.json({ success: true, orderId: order.id, amount, currency: 'INR', courseName: course.title });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment & enroll
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, demoMode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Skip signature verification in demo mode
    if (!demoMode) {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentId: razorpay_payment_id || 'demo_payment_' + Date.now(),
      orderId: razorpay_order_id,
      amount: course.discountedPrice || course.price,
      paymentStatus: 'completed'
    });

    // Update course student count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });

    // Send email
    await sendEnrollmentEmail(req.user.email, req.user.name, course.title);

    res.json({ success: true, message: 'Enrollment successful!', enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
