const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  duration: Number, // in minutes
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  instructor: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: Number,
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  tags: [String],
  modules: [moduleSchema],
  totalStudents: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courseSchema.virtual('totalLessons').get(function () {
  return this.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
});

courseSchema.virtual('totalDuration').get(function () {
  return this.modules.reduce((acc, mod) => 
    acc + mod.lessons.reduce((a, l) => a + (l.duration || 0), 0), 0);
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
