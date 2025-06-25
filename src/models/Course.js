import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  image: {
    type: String,
    default: '/images/default-course.png'
  },
  duration: {
    type: String,
    required: [true, 'Please provide course duration']
  },

  icon: {
  type: String,
  enum: ['spring', 'react', 'node', 'code'],
  default: 'code'
},


  level: {
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },

  category: {
    type: String,
    required: [true, 'Please provide a course category'],
  },
  
  bgColor: {
    type: String,
    default: 'from-blue-500 to-purple-500'
  },

  instructor: {
    type:String,
    required:false,
  },

  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
