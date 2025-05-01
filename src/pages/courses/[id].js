import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, Clock, Book, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Course data - in a real app, this would come from an API
  const courses = [
    {
      id: 1,
      title: "Spring Boot: Mastering the Fundamentals",
      description:
        "Master dependency injection and core Spring Boot concepts to build robust applications.",
      longDescription:
        "This comprehensive course covers all the fundamentals of Spring Boot, from basic concepts to advanced techniques. You'll learn dependency injection, application configuration, data access, testing strategies, and more. By the end of this course, you'll be able to build robust Spring Boot applications with confidence.",
      category: "Backend",
      image: "/images/spring-boot.png",
      duration: "6h",
      lessons: 24,
      students: 2453,
      level: "Intermediate",
      part: "PART 1",
      bgColor: "from-green-400 to-yellow-300",
      icon: "spring",
      topics: [
        "Spring Boot fundamentals",
        "Dependency injection patterns",
        "Configuration management",
        "Spring Data access",
        "Database integration",
        "Testing Spring applications",
        "Spring Boot actuator",
        "Spring profiles and environments",
      ],
      instructor: {
        name: "Alex Johnson",
        role: "Senior Java Engineer",
        image: "/images/instructor1.jpg",
      },
    },
    // ... other course objects
  ];

  // Render icon based on course type
  const renderIcon = (iconType) => {
    switch (iconType) {
      case "spring":
        return (
          <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              className="text-green-500"
            >
              <path
                fill="currentColor"
                d="M20.59,6.27c-0.27-2.18-1.94-4.95-2.78-5.71c-0.36-0.32-0.87-0.36-1.28-0.07c-0.17,0.12-0.28,0.28-0.35,0.47 c-0.01,0.03-0.03,0.06-0.04,0.09c-0.54,1.23-0.09,2.79,0.41,3.96c0.61,1.46,1.36,2.75,1.36,3.99c0,0.05-0.03,1.31-1.18,2.25 c-0.68,0.56-1.86,0.95-3.31,0.51c-4.77-1.45-9.88,0.53-10.91,5.18c-0.16,0.72-0.18,1.47-0.8,2.17c-0.09,0.13-0.11,0.29-0.05,0.44 c0.06,0.15,0.19,0.26,0.34,0.3c1.37,0.36,2.67-0.61,3.64-1.28c0.39-0.27,0.82-0.54,1.19-0.63c0.34-0.08,0.68,0.05,0.92,0.3 c0.24,0.25,0.35,0.63,0.26,0.98c-0.16,0.62-0.56,1.32-0.91,1.9c-0.25,0.41-0.46,0.76-0.58,1.09c-0.02,0.05-0.03,0.1-0.04,0.15 c-0.14,0.82,0.29,1.63,1.02,1.93c0.7,0.29,1.48,0.12,1.93-0.45c0.16-0.2,0.29-0.42,0.35-0.67c0.17-0.64,0.29-1.3,0.36-1.96 c0.14-1.22,0.31-2.76,1.82-3.86c1.41-1.03,3.36-0.79,4.89-0.38c0.99,0.27,1.94,0.7,2.63,1.26c0.23,0.18,0.46,0.43,0.71,0.69 c0.25,0.26,0.49,0.52,0.78,0.72c0.34,0.24,0.74,0.33,1.11,0.26c0.37-0.07,0.68-0.3,0.88-0.66c0.16-0.29,0.14-0.64-0.03-0.93 c-0.22-0.37-0.57-0.71-0.91-1.04c-0.4-0.39-0.8-0.78-1.1-1.26c-0.07-0.11-0.12-0.22-0.15-0.34c-0.36-1.17,0.21-2.39,1.36-2.89 c1.07-0.46,2.03-0.33,3.11-0.17c0.46,0.07,0.93,0.14,1.4,0.12c0.31-0.01,0.62-0.09,0.9-0.27c0.29-0.19,0.5-0.48,0.6-0.81 c0.18-0.62-0.09-1.28-0.65-1.62c-0.18-0.11-0.39-0.17-0.61-0.19c-0.86-0.08-1.76,0.14-2.65,0.36c-0.35,0.09-0.69,0.17-1.03,0.22 c-0.6,0.09-1.2-0.01-1.73-0.3c-0.53-0.28-0.93-0.72-1.13-1.24c-0.39-1.04-0.16-2.17,0.03-3.13C20.65,7.59,20.66,6.92,20.59,6.27z M10.72,14.08c-0.56,0-1.01-0.45-1.01-1.01c0-0.56,0.45-1.01,1.01-1.01s1.01,0.45,1.01,1.01C11.73,13.63,11.28,14.08,10.72,14.08z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (id) {
      // In a real application, fetch course data from an API
      // For now, we'll use our static data
      const selectedCourse = courses.find((c) => c.id === parseInt(id));
      setCourse(selectedCourse);
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-6">Course not found</div>
        <Link
          href="/courses"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
       <Link
          href="/courses"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Course Icon */}
          <div
            className={`w-full lg:w-1/3 bg-gradient-to-r ${course.bgColor} rounded-lg p-8 flex items-center justify-center`}
          >
            <div className="h-48 w-48">{renderIcon(course.icon)}</div>
          </div>

          {/* Course Info */}
          <div className="w-full lg:w-2/3">
            {course.part && (
              <div className="inline-block bg-green-500 text-white px-3 py-1 text-sm font-medium mb-4 rounded">
                {course.part}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-gray-300 mb-6">
              {course.longDescription}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Book className="h-5 w-5 mr-2" />
                <span>{course.lessons} Lessons</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.students.toLocaleString()} Students</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="h-5 w-5 mr-2" />
                <span>{course.level}</span>
              </div>
            </div>
            <Link key={course.id} href={`/subscriptions`} passHref>
            <button className="hover:bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors">
              Enroll Now
            </button>
            </Link>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.topics.map((topic, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Course Description</h2>
              <p className="text-gray-300 mb-4">{course.longDescription}</p>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Instructor</h2>
            <div className="flex items-center gap-6">
              <img
                src={course.instructor.image}
                alt={course.instructor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                <p className="text-gray-300">{course.instructor.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
