import { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

export default function StudentDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the proper S3 image URL
  const getCourseImageUrl = (course) => {
    // Debug logging
    console.log('Course object in dashboard:', course);
    console.log('Course image property:', course.image);
    
    // Try different possible image property names
    const imageUrl = course.image || course.courseImage || course.thumbnail || course.picture;
    
    if (imageUrl) {
      // If image starts with 'images/', prepend your actual S3 domain
      if (imageUrl.startsWith('images/')) {
        const fullUrl = `https://adminjs-media-storage.s3.ap-south-1.amazonaws.com/${imageUrl}`;
        console.log('Generated S3 URL:', fullUrl);
        return fullUrl;
      }
      // If it's already a full URL, use as is
      console.log('Using existing URL:', imageUrl);
      return imageUrl;
    }
    console.log('No image found, returning null for default gradient');
    return null; // Return null instead of placeholder path
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/student/enrolled-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          console.log(response.data.data.enrolledCourses,'Response of enrolled courses')
          setEnrolledCourses(response.data.data.enrolledCourses);
        } else {
          setError(response.data.error || 'Failed to load enrolled courses');
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view these courses');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to load enrolled courses. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to access your dashboard</p>
          <Link href="/login" className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container mx-auto px-4 pt-6 pb-8 text-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Welcome back, {user.name?.split(" ")[0] || 'Student'}!
          </h2>
          <p className="text-gray-500 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-800">{enrolledCourses.length}</p>
                <p className="text-gray-500 text-sm">Enrolled Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-800">
                  {enrolledCourses.reduce((total, course) => total + (course.totalChapters || 0), 0)}
                </p>
                <p className="text-gray-500 text-sm">Total Chapters</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-800">
                  {enrolledCourses.length > 0 ? 'Active' : 'Ready to Start'}
                </p>
                <p className="text-gray-500 text-sm">Learning Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Your Enrolled Courses
            </h3>
            {enrolledCourses.length > 6 && (
              <Link href="/courses" className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors">
                View All
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg h-64 animate-pulse shadow-sm border border-gray-200"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
              {error.includes('session has expired') && (
                <Link href="/login" className="mt-4 inline-block text-blue-500 hover:text-blue-600 transition-colors">
                  Go to Login
                </Link>
              )}
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">No Courses Yet</h4>
              <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
              <Link href="/courses" className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-md inline-block transition-colors">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => {
                const imageUrl = getCourseImageUrl(course);
                
                return (
                  <div key={course.courseId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="w-full h-32 sm:h-40 relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide broken image and show gradient background
                            e.target.style.display = 'none';
                            const gradientDiv = e.target.nextElementSibling;
                            if (gradientDiv) {
                              gradientDiv.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      {/* Gradient fallback */}
                      <div 
                        className={`w-full h-full bg-gradient-to-r from-blue-300 to-purple-300 flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
                      >
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        Instructor: {course.instructor || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {course.totalChapters || 0} chapters
                      </p>

                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            Last accessed: {formatDate(course.lastAccessed || course.enrolledAt)}
                          </span>
                        </div>
                      </div>

                      <Link href={`/courses/watch/${course.courseId}`}>
                        <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center mt-4 transition-colors">
                          <span>Continue Learning</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </Link>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Next: {course.nextLesson || 'Start Course'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}