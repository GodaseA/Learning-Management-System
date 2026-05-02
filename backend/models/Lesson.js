const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isFree: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
