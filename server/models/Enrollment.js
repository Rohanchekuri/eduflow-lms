const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId },
  moduleId: { type: mongoose.Schema.Types.ObjectId },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  watchedDuration: { type: Number, default: 0 }
});

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  paymentId: { type: String },
  orderId: { type: String },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  progress: [lessonProgressSchema],
  progressPercentage: { type: Number, default: 0 },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date,
  lastAccessedAt: { type: Date, default: Date.now }
});

enrollmentSchema.methods.calculateProgress = function (totalLessons) {
  if (totalLessons === 0) return 0;
  const completed = this.progress.filter(p => p.completed).length;
  this.progressPercentage = Math.round((completed / totalLessons) * 100);
  return this.progressPercentage;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
