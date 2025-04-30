import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  
  // Static course data
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
      case 'python':
        return (
          <div className="flex">
            <img src="/images/python.png" alt="Python" className="h-16" />
          </div>
        );
      case 'react':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-blue-500">
              <path fill="currentColor" d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zM16.795 22.677c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zM12 16.878c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
            </svg>
          </div>
        );
      case 'node':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-green-600">
              <path fill="currentColor" d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.027.129-.016.185.021l1.874 1.12c.074.036.166.036.226 0l7.294-4.215c.070-.039.115-.12.115-.199V8.744c0-.084-.045-.16-.115-.198l-7.294-4.217c-.068-.039-.166-.039-.226 0l-7.29 4.217c-.075.043-.12.118-.12.198v8.422c0 .077.045.156.12.196l1.994 1.153c1.079.54 1.76-.096 1.76-.734V9.433c0-.118.097-.213.213-.213h.922c.116 0 .213.094.213.213v8.295c0 1.439-.783 2.26-2.156 2.26-.422 0-.752 0-1.678-.458l-1.905-1.102A1.536 1.536 0 0 1 3 17.225V8.803c0-.564.296-1.088.773-1.37l7.318-4.22a1.62 1.62 0 0 1 1.618 0l7.294 4.22c.479.282.774.81.774 1.37v8.422c0 .565-.295 1.087-.774 1.372l-7.294 4.217c-.24.136-.515.205-.773.205zm2.216-9.2c-3.19 0-3.855-1.46-3.855-2.694 0-.118.092-.213.213-.213h.94c.104 0 .192.08.208.182.149.984.574 1.478 2.491 1.478 1.533 0 2.182-.345 2.182-1.16 0-.47-.184-.815-2.569-1.049-1.984-.194-3.215-.636-3.215-2.225 0-1.467 1.238-2.339 3.313-2.339 2.339 0 3.488.81 3.635 2.558.006.057-.014.112-.053.155-.039.042-.098.069-.154.069h-.944a.212.212 0 0 1-.202-.164c-.227-1.002-.775-1.323-2.282-1.323-1.679 0-1.875.584-1.875 1.02 0 .532.23.686 2.483.986 2.237.302 3.3.728 3.3 2.27-.005 1.586-1.32 2.5-3.616 2.5z"/>
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="40" height="40" className="text-yellow-500">
              <path fill="currentColor" d="M8.293 6.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L12.586 12 8.293 7.707a1 1 0 0 1 0-1.414z"/>
              <path fill="currentColor" d="M15.707 6.293a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L11.414 12l4.293-4.293a1 1 0 0 0 0-1.414z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const handleCourseClick = (courseId) => {
    // Handle navigation to course details page
    console.log(`Navigating to course ${courseId}`);
    // You would typically use router.push or similar here
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
            <div 
              key={course.id} 
              onClick={() => handleCourseClick(course.id)}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-xl"
            >
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}