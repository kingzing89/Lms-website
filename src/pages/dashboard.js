import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState({
    name: 'Malik Faraz',
    email: 'malikfarazdev@gmail.com',
    enrolled: [
      {
        id: 1,
        title: 'React Fundamentals',
        image: '/api/placeholder/280/160',
        instructor: 'Sarah Johnson',
        nextLesson: 'Component Lifecycle'
      },
      {
        id: 2,
        title: 'Advanced JavaScript',
        image: '/api/placeholder/280/160',
        instructor: 'Michael Chen',
        nextLesson: 'Promises and Async/Await'
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        image: '/api/placeholder/280/160',
        instructor: 'Elena Rodriguez',
        nextLesson: 'Building RESTful APIs'
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-900 py-32">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4  pt-6 pb-8 text-white">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className="text-gray-400 mt-2">Continue your learning journey</p>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Your Enrolled Courses</h3>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.enrolled.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">Instructor: {course.instructor}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500">Last accessed: {course.lastAccessed}</span>
                    </div>
                    
                  </div>
                  
                  {/* Continue button */}
                  <div className="mt-4">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
                      <span>Continue Learning</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Next: {course.nextLesson}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}