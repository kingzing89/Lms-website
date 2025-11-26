import connectToDatabase from '../../../lib/mongodb';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import UserSubscription from '@/models/UserSubscription';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id: courseId } = req.query;

  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      
      const user = await getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }
      
      const userId = user._id;

      // FIXED: Use direct query instead of non-existent static method
      const activeSubscription = await UserSubscription.findOne({
        userId: userId,
        status: 'active',
        endDate: { $gte: new Date() }
      }).populate('subscriptionPlanId');
      
      if (!activeSubscription) {
        return res.status(403).json({ 
          success: false, 
          error: 'Active subscription required to enroll in courses',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).json({ success: false, error: 'Course not found' });
      }

      const existingEnrollment = await Enrollment.findOne({ userId, courseId });
      
      if (existingEnrollment) {
        return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
      }

      const enrollment = new Enrollment({
        userId,
        courseId,
        nextLesson: course.chapters.length > 0 ? 'Start with Chapter 1' : 'Start Course'
      });

      await enrollment.save();

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course',
        data: {
          enrollmentId: enrollment._id,
          courseTitle: course.title,
          subscriptionPlan: activeSubscription.subscriptionPlanId?.title || 'Premium Subscription'
        }
      });

    } catch (error) {
      console.error('Error enrolling in course:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
      }

      res.status(500).json({ 
        success: false, 
        error: 'Failed to enroll in course',
        details: error.message // Temporarily include for debugging
      });
    }

  } else if (req.method === 'DELETE') {
    try {
      await connectToDatabase();
      
      const user = await getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }
      
      const userId = user._id;

      // FIXED: Use direct query
      const activeSubscription = await UserSubscription.findOne({
        userId: userId,
        status: 'active',
        endDate: { $gte: new Date() }
      });
      
      if (!activeSubscription) {
        return res.status(403).json({ 
          success: false, 
          error: 'Active subscription required to manage enrollments',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
      
      if (!enrollment) {
        return res.status(404).json({ success: false, error: 'Enrollment not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Successfully unenrolled from course'
      });

    } catch (error) {
      console.error('Error unenrolling from course:', error);
      res.status(500).json({ success: false, error: 'Failed to unenroll from course' });
    }

  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function getCurrentUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}