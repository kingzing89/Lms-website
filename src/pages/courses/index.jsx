import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  
  const courses = [
    {
      id: 1,
      title: "Spring Boot: Mastering the Fundamentals",
      description: "Master dependency injection and core Spring Boot concepts to build robust applications.",
      category: "Backend",
      image: "/images/spring-boot.png",
      duration: "6h",
      part: "PART 1",
      bgColor: "from-green-400 to-yellow-300",
      icon: "spring"
    },
    {
      id: 2,
      title: "Spring Boot: Mastering REST API Development",
      description: "Build REST APIs, secure them with JWT, and implement advanced features with Spring Boot.",
      category: "Backend",
      image: "/images/spring-boot.png",
      duration: "9h",
      part: "PART 2",
      bgColor: "from-green-400 to-yellow-300",
      icon: "spring"
    },
    {
      id: 3,
      title: "Complete Python Mastery",
      description: "Everything you need to program in Python in one course (includes 3 real-world projects).",
      category: "Programming",
      image: "/images/python.png",
      duration: "12h",
      bgColor: "from-blue-500 via-purple-500 to-pink-500",
      icon: "python"
    },
    {
      id: 4,
      title: "React: From Zero to Expert",
      description: "Build modern, reactive web applications with React and its ecosystem.",
      category: "Frontend",
      image: "/images/react.png",
      duration: "10h",
      bgColor: "from-cyan-400 to-blue-500",
      icon: "react"
    },
    {
      id: 5,
      title: "Node.js: The Complete Guide",
      description: "Master Node.js by building real-world applications with MongoDB, Express, and more.",
      category: "Backend",
      image: "/images/nodejs.png",
      duration: "14h",
      bgColor: "from-green-500 to-green-700",
      icon: "node"
    },
    {
      id: 6,
      title: "Data Structures & Algorithms in JavaScript",
      description: "Learn how to implement and use essential data structures and algorithms in JavaScript.",
      category: "Computer Science",
      image: "/images/algorithms.png",
      duration: "8h",
      bgColor: "from-yellow-400 to-orange-500",
      icon: "code"
    }
  ];
  
  const categories = ['All Courses', 'Frontend', 'Backend', 'Programming', 'Computer Science'];
  
  // Filter courses based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Render icon based on course type
  const renderIcon = (iconType) => {
    switch(iconType) {
      case 'spring':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-green-500">
              <path fill="currentColor" d="M20.59,6.27c-0.27-2.18-1.94-4.95-2.78-5.71c-0.36-0.32-0.87-0.36-1.28-0.07c-0.17,0.12-0.28,0.28-0.35,0.47 c-0.01,0.03-0.03,0.06-0.04,0.09c-0.54,1.23-0.09,2.79,0.41,3.96c0.61,1.46,1.36,2.75,1.36,3.99c0,0.05-0.03,1.31-1.18,2.25 c-0.68,0.56-1.86,0.95-3.31,0.51c-4.77-1.45-9.88,0.53-10.91,5.18c-0.16,0.72-0.18,1.47-0.8,2.17c-0.09,0.13-0.11,0.29-0.05,0.44 c0.06,0.15,0.19,0.26,0.34,0.3c1.37,0.36,2.67-0.61,3.64-1.28c0.39-0.27,0.82-0.54,1.19-0.63c0.34-0.08,0.68,0.05,0.92,0.3 c0.24,0.25,0.35,0.63,0.26,0.98c-0.16,0.62-0.56,1.32-0.91,1.9c-0.25,0.41-0.46,0.76-0.58,1.09c-0.02,0.05-0.03,0.1-0.04,0.15 c-0.14,0.82,0.29,1.63,1.02,1.93c0.7,0.29,1.48,0.12,1.93-0.45c0.16-0.2,0.29-0.42,0.35-0.67c0.17-0.64,0.29-1.3,0.36-1.96 c0.14-1.22,0.31-2.76,1.82-3.86c1.41-1.03,3.36-0.79,4.89-0.38c0.99,0.27,1.94,0.7,2.63,1.26c0.23,0.18,0.46,0.43,0.71,0.69 c0.25,0.26,0.49,0.52,0.78,0.72c0.34,0.24,0.74,0.33,1.11,0.26c0.37-0.07,0.68-0.3,0.88-0.66c0.16-0.29,0.14-0.64-0.03-0.93 c-0.22-0.37-0.57-0.71-0.91-1.04c-0.4-0.39-0.8-0.78-1.1-1.26c-0.07-0.11-0.12-0.22-0.15-0.34c-0.36-1.17,0.21-2.39,1.36-2.89 c1.07-0.46,2.03-0.33,3.11-0.17c0.46,0.07,0.93,0.14,1.4,0.12c0.31-0.01,0.62-0.09,0.9-0.27c0.29-0.19,0.5-0.48,0.6-0.81 c0.18-0.62-0.09-1.28-0.65-1.62c-0.18-0.11-0.39-0.17-0.61-0.19c-0.86-0.08-1.76,0.14-2.65,0.36c-0.35,0.09-0.69,0.17-1.03,0.22 c-0.6,0.09-1.2-0.01-1.73-0.3c-0.53-0.28-0.93-0.72-1.13-1.24c-0.39-1.04-0.16-2.17,0.03-3.13C20.65,7.59,20.66,6.92,20.59,6.27z M10.72,14.08c-0.56,0-1.01-0.45-1.01-1.01c0-0.56,0.45-1.01,1.01-1.01s1.01,0.45,1.01,1.01C11.73,13.63,11.28,14.08,10.72,14.08z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Build Real-World Skills</h1>
          <p className="text-xl text-gray-300">
            Master software development with structured courses designed to make you job-ready.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category dropdown */}
          <div className="md:w-64">
            <select
              className="block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} passHref>
              {/* <a className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-xl"> */}
                <div className={`h-48 bg-gradient-to-r ${course.bgColor} relative`}>
                  {course.part && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-sm font-medium">
                      {course.part}
                    </div>
                  )}
                  <div className="flex items-center justify-center h-full">
                    {renderIcon(course.icon)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2 flex-1">{course.title}</h3>
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                      {course.duration}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-2">{course.description}</p>
                </div>
              {/* </a> */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
