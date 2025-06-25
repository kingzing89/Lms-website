// models/Enrollment.js
import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    completedChapters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    }],
    currentChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  nextLesson: {
    type: String,
    default: 'Start Course'
  }
}, { timestamps: true });

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

EnrollmentSchema.index({ userId: 1 });
EnrollmentSchema.index({ courseId: 1 });

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;