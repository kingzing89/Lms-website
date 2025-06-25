// pages/api/student/enrolled-courses.js
import connectToDatabase from '../../../lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import User from '@/models/User';
import UserSubscription from '@/models/UserSubscription'; // Add this import
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Get authenticated user
    const user = await getCurrentUser(req);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Check if user's subscription is active using the UserSubscription model
    const isSubscriptionActive = await checkSubscriptionStatus(user._id);
    
    if (!isSubscriptionActive) {
      // Delete all enrollments for this expired user
      await Enrollment.deleteMany({ userId: user._id });
      
      return res.status(200).json({
        success: true,
        data: {
          enrolledCourses: [],
          totalEnrolled: 0,
          message: 'Your subscription has expired. Please renew to access courses.'
        }
      });
    }

    // Continue with normal flow for active users
    const enrollments = await Enrollment.find({ userId: user._id })
      .populate({
        path: 'courseId',
        model: 'Course',
        select: 'title description instructor image chapters isPublished createdAt',
      })
      .sort({ createdAt: -1 });

    const validEnrollments = enrollments.filter(enrollment => enrollment.courseId);

    const enrolledCourses = validEnrollments.map(enrollment => ({
      enrollmentId: enrollment._id,
      courseId: enrollment.courseId._id,
      title: enrollment.courseId.title,
      description: enrollment.courseId.description,
      instructor: enrollment.courseId.instructor,
      thumbnail: enrollment.courseId.image || '/api/placeholder/280/160',
      nextLesson: enrollment.nextLesson || 'Start Course',
      enrolledAt: enrollment.createdAt,
      lastAccessed: enrollment.updatedAt,
      totalChapters: enrollment.courseId.chapters?.length || 0,
      progress: 0 
    }));

    res.status(200).json({
      success: true,
      data: {
        enrolledCourses,
        totalEnrolled: enrolledCourses.length
      }
    });

  } catch (err) {
    console.error('⚠️ Error fetching enrolled courses:', err.response || err.message || err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load enrolled courses.' 
    });
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

// Updated function to check subscription using UserSubscription model
async function checkSubscriptionStatus(userId) {
  try {
    const subscription = await UserSubscription.findOne({ userId });
    
    if (!subscription) {
      return false;
    }

    const now = new Date();
    const subscriptionEndDate = new Date(subscription.endDate);
    
    // Check if subscription is active and not expired
    const isActive = subscription.status === 'active' && subscriptionEndDate > now;
    
    // If subscription is expired, update the status
    if (subscriptionEndDate <= now && subscription.status === 'active') {
      subscription.status = 'expired';
      await subscription.save();
      return false;
    }
    
    return isActive;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}