import connectToDatabase from '../../../lib/mongodb';
import Course from '@/models/Course';
import Chapter from '@/models/Chapter';
import Video from '@/models/Video';

export default async function handler(req, res) {
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    
    await connectToDatabase();
    console.log('Connected to database successfully');
    
    const { id } = req.query;
    
    
    if (!id || id.length < 1) {
      console.log('Invalid ID provided:', id);
      return res.status(400).json({
        success: false, 
        error: 'Invalid course ID' 
      });
    }
    
    console.log('Searching for course with ID:', id);
    
    const course = await Course.findById(id)
      .populate({
        path: 'chapters',
        model: 'Chapter',
        populate: {
          path: 'videos',
          model: 'Video'
        }
      });
    
    console.log('Course found:', course ? 'Yes' : 'No');
    
    if (!course) {
      console.log('Course not found in database for ID:', id);
      return res.status(404).json({
        success: false, 
        error: 'Course not found' 
      });
    }
    
    // Add some debug info about the populated data
    console.log('Course chapters count:', course.chapters?.length || 0);
    if (course.chapters?.length > 0) {
      console.log('First chapter videos count:', course.chapters[0].videos?.length || 0);
      if (course.chapters[0].videos?.length > 0) {
        console.log('First video data:', {
          title: course.chapters[0].videos[0].title,
          url: course.chapters[0].videos[0].url
        });
      }
    }
    
    console.log('Returning course data successfully');
    return res.status(200).json({ 
      success: true, 
      data: course 
    });
    
  } catch (error) {
    console.error(`Detailed error fetching course ${req.query?.id}:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({
      success: false, 
      error: 'Failed to fetch course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}