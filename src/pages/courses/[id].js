import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, Clock, Book, Users, Globe } from "lucide-react";
import Link from "next/link";
import { useAuth } from '../../contexts/AuthContext';


export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoggedIn } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState(null)


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





  useEffect(() => {
    if (id) {
      const fetchCourseData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/courses/${id}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            setCourse(result.data);
          } else {
            console.error("Failed to fetch course data:", result.error);
          }

           if (isLoggedIn && token) {
             const statusRes = await fetch(`/api/enrollments/${id}/status`, {
               headers: { Authorization: `Bearer ${token}` },
             });

             if (statusRes.ok) {
               const statusJson = await statusRes.json();
               console.log(statusJson,'status Response here');
               setEnrollmentStatus(
                 statusJson.enrolled ? "enrolled" : "not-enrolled"
               );
             }
           }
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCourseData();
    }
  }, [id,isLoggedIn, token]);


const handleEnroll = async () => {
  try {
  
    if (!isLoggedIn || !token) {
      alert("You must be logged in to enroll.");
      router.push("/login");
      return;
    }

    const res = await fetch(`/api/enrollments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ Successfully enrolled in "${data.data.courseTitle}"`);
      // Optionally redirect to course player:
      // router.push(`/courses/${id}/start`);
    } else {
      if (data.code === "SUBSCRIPTION_REQUIRED") {
        if (confirm("⚠️ You need a subscription to enroll. Go to plans?")) {
          router.push("/subscriptions");
        }
      } else {
        alert(`❌ ${data.error}`);
      }
    }
  } catch (error) {
    console.error("Enrollment error:", error);
    alert("❌ Unexpected error during enrollment.");
  }
};



  // Function to calculate total video count
  const getTotalVideoCount = () => {
    if (!course?.chapters) return 0;
    return course.chapters.reduce((total, chapter) => total + (chapter.videos?.length || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center">
        <div className="text-2xl mb-6">Course not found</div>
        <Link
          href="/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-30 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Course Icon */}
         

          {/* Course Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Book className="h-5 w-5 mr-2" />
                <span>{getTotalVideoCount()} Videos</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Globe className="h-5 w-5 mr-2" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.category}</span>
              </div>
            </div>

            {isLoggedIn && enrollmentStatus === "enrolled" ? (
              <Link
                href={`#`}
                className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-6 rounded-md font-medium transition-colors border border-green-200"
              >
                Already Enrolled access the course from dashboard
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors shadow-sm"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Description</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Curriculum</h2>

              {course.chapters && course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => (
                      <div
                        key={chapter._id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <div className="bg-gray-100 p-4 flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {chapter.title}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {chapter.videos?.length || 0}{" "}
                            {chapter.videos?.length === 1 ? "video" : "videos"}
                          </div>
                        </div>

                        {/* Chapter Videos */}
                        {chapter.videos && chapter.videos.length > 0 && (
                          <div className="bg-white">
                            {chapter.videos.map((video, videoIndex) => (
                              <div
                                key={video._id}
                                className="px-6 py-3 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                      {videoIndex + 1}
                                    </div>
                                    <span className="text-gray-700">
                                      {video.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No curriculum available for this course yet.
                </p>
              )}
            </div>
          </div>

          {/* Instructor Info */}
          <div className="bg-white rounded-lg p-8 h-fit shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Instructor</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {course.instructor || "Instructor Name"}
                </h3>
                <p className="text-gray-600">Course Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}