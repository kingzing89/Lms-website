'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/courses');

        console.log('No Courses Exist Here Right Now',response);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        setCourses(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  const allCategories = courses.length > 0 
    ? ['All Courses', ...new Set(courses.map(course => course.category).filter(Boolean))]
    : ['All Courses'];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Courses' || 
                           (course.category && course.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

 // Replace your current getCourseImageUrl function with this:
const getCourseImageUrl = (course) => {
  if (course.image) {
    // If image starts with 'images/', prepend your actual S3 domain
    if (course.image.startsWith('images/')) {
      return `https://adminjs-media-storage.s3.ap-south-1.amazonaws.com/${course.image}`;
    }
    // If it's already a full URL, use as is
    return course.image;
  }
  return null;
};

  const renderIcon = (iconType) => {
    switch(iconType) {
      case 'spring':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-green-600">
              <path fill="currentColor" d="M20.59,6.27c-0.27-2.18-1.94-4.95-2.78-5.71c-0.36-0.32-0.87-0.36-1.28-0.07c-0.17,0.12-0.28,0.28-0.35,0.47 c-0.01,0.03-0.03,0.06-0.04,0.09c-0.54,1.23-0.09,2.79,0.41,3.96c0.61,1.46,1.36,2.75,1.36,3.99c0,0.05-0.03,1.31-1.18,2.25 c-0.68,0.56-1.86,0.95-3.31,0.51c-4.77-1.45-9.88,0.53-10.91,5.18c-0.16,0.72-0.18,1.47-0.8,2.17c-0.09,0.13-0.11,0.29-0.05,0.44 c0.06,0.15,0.19,0.26,0.34,0.3c1.37,0.36,2.67-0.61,3.64-1.28c0.39-0.27,0.82-0.54,1.19-0.63c0.34-0.08,0.68,0.05,0.92,0.3 c0.24,0.25,0.35,0.63,0.26,0.98c-0.16,0.62-0.56,1.32-0.91,1.9c-0.25,0.41-0.46,0.76-0.58,1.09c-0.02,0.05-0.03,0.1-0.04,0.15 c-0.14,0.82,0.29,1.63,1.02,1.93c0.7,0.29,1.48,0.12,1.93-0.45c0.16-0.2,0.29-0.42,0.35-0.67c0.17-0.64,0.29-1.3,0.36-1.96 c0.14-1.22,0.31-2.76,1.82-3.86c1.41-1.03,3.36-0.79,4.89-0.38c0.99,0.27,1.94,0.7,2.63,1.26c0.23,0.18,0.46,0.43,0.71,0.69 c0.25,0.26,0.49,0.52,0.78,0.72c0.34,0.24,0.74,0.33,1.11,0.26c0.37-0.07,0.68-0.3,0.88-0.66c0.16-0.29,0.14-0.64-0.03-0.93 c-0.22-0.37-0.57-0.71-0.91-1.04c-0.4-0.39-0.8-0.78-1.1-1.26c-0.07-0.11-0.12-0.22-0.15-0.34c-0.36-1.17,0.21-2.39,1.36-2.89 c1.07-0.46,2.03-0.33,3.11-0.17c0.46,0.07,0.93,0.14,1.4,0.12c0.31-0.01,0.62-0.09,0.9-0.27c0.29-0.19,0.5-0.48,0.6-0.81 c0.18-0.62-0.09-1.28-0.65-1.62c-0.18-0.11-0.39-0.17-0.61-0.19c-0.86-0.08-1.76,0.14-2.65,0.36c-0.35,0.09-0.69,0.17-1.03,0.22 c-0.6,0.09-1.2-0.01-1.73-0.3c-0.53-0.28-0.93-0.72-1.13-1.24c-0.39-1.04-0.16-2.17,0.03-3.13C20.65,7.59,20.66,6.92,20.59,6.27z M10.72,14.08c-0.56,0-1.01-0.45-1.01-1.01c0-0.56,0.45-1.01,1.01-1.01s1.01,0.45,1.01,1.01C11.73,13.63,11.28,14.08,10.72,14.08z"/>
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-amber-600">
              <path fill="currentColor" d="M8.5,14.5L4,10l4.5-4.5L7,4L1,10l6,6L8.5,14.5z M15.5,14.5L20,10l-4.5-4.5L17,4l6,6l-6,6L15.5,14.5z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-blue-600">
              <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"/>
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-slate-900">Build Real-World Skills</h1>
            <p className="text-xl text-slate-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-slate-900">Something went wrong</h1>
            <p className="text-xl text-slate-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">Build Real-World Skills</h1>
          <p className="text-xl text-slate-600">
            Master software development with structured courses designed to make you job-ready.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="md:w-64">
            <select
              className="block w-full py-3 px-3 border border-slate-200 bg-white text-slate-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No courses found matching your criteria.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const imageUrl = getCourseImageUrl(course);
            
            return (
              <Link key={course._id} href={`/courses/${course._id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-xl hover:transform hover:scale-105">
                  <div className={`h-48 relative ${!imageUrl ? `bg-gradient-to-r ${course.bgColor || 'from-blue-400 to-indigo-500'}` : ''}`}>
                    {course.part && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 text-sm font-medium rounded-full z-10 shadow-md">
                        {course.part}
                      </div>
                    )}
                    
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          
                          e.target.style.display = 'none';
                        
                          const iconDiv = document.createElement('div');
                          iconDiv.className = 'flex items-center justify-center h-full';
                          iconDiv.innerHTML = e.target.parentElement.querySelector('.fallback-icon')?.innerHTML || '';
                          e.target.parentElement.appendChild(iconDiv);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {renderIcon(course.icon)}
                      </div>
                    )}
                    
                    {/* Hidden fallback icon for error handling */}
                    <div className="fallback-icon" style={{display: 'none'}}>
                      {renderIcon(course.icon)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2 flex-1 text-slate-900">{course.title}</h3>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {course.duration}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-2 leading-relaxed">{course.description}</p>
                    {course.level && (
                      <div className="mt-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {course.level}
                        </span>
                      </div>
                    )}
                    {course.instructor && (
                      <div className="mt-3 text-sm text-slate-500 flex items-center">
                        <span className="font-medium">Instructor:</span>
                        <span className="ml-1">{typeof course.instructor === 'string' ? course.instructor : course.instructor.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}