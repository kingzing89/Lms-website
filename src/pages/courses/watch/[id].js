// pages/courses/watch/[id].js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Play, Pause, Volume2, Volume1, VolumeX, Maximize } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

export default function CourseVideoPlayer() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token, isAuthenticated } = useAuth();
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        console.log('No course ID available');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching course with ID:', id);
        
        const response = await axios.get(`/api/courses/${id}?populate=true`);
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setCourse(response.data.data);
          console.log('Course data set:', response.data.data);
        } else {
          setError(response.data.error || 'Course not found');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        if (err.response?.status === 404) {
          setError('Course not found');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to load course. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const getS3VideoUrl = (videoPath) => {
    if (!videoPath) return null;
    
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET || 'adminjs-media-storage';
    const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';
    
    const cleanPath = videoPath.startsWith('/') ? videoPath.slice(1) : videoPath;
    
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cleanPath}`;
  };

  const getCurrentVideoUrl = () => {
    if (!course?.chapters?.[currentChapterIndex]?.videos?.[currentVideoIndex]) {
      return null;
    }
    
    const currentVideo = course.chapters[currentChapterIndex].videos[currentVideoIndex];
    return getS3VideoUrl(currentVideo.url);
  };

  const getCurrentVideo = () => {
    if (!course?.chapters?.[currentChapterIndex]?.videos?.[currentVideoIndex]) {
      return null;
    }
    
    return course.chapters[currentChapterIndex].videos[currentVideoIndex];
  };

  const getCurrentChapter = () => {
    if (!course?.chapters?.[currentChapterIndex]) {
      return null;
    }
    
    return course.chapters[currentChapterIndex];
  };

  const handleVideoLoad = () => {
    setVideoError(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume / 100;
    }
  };

  const handleVideoError = (e) => {
    console.error('Video loading error:', e);
    setVideoError(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure video starts playing from current position
        const playPromise = videoRef.current.play();
        
        // Handle play promise (required for some browsers)
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Error playing video:', error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value);
    if (videoRef.current && duration) {
      const newTime = (value / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 50) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  // Navigate to different video
  const selectVideo = (chapterIndex, videoIndex) => {
    // Pause current video before switching
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    
    setCurrentChapterIndex(chapterIndex);
    setCurrentVideoIndex(videoIndex);
    setIsPlaying(false);  // Always start paused
    setProgress(0);
    setCurrentTime(0);
    setVideoError(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Course Not Available</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-md mr-4 transition-colors"
            >
              Try Again
            </button>
            <Link href="/dashboard" className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No course found
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-center">
          <h2 className="text-2xl font-semibold mb-4">Course Not Found</h2>
          <p className="text-gray-500 mb-6">The course you are looking for does not exist or you do not have access to it.</p>
          <Link href="/dashboard" className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = getCurrentVideoUrl();
  const currentVideo = getCurrentVideo();
  const currentChapter = getCurrentChapter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 px-6 shadow-sm border-b border-gray-200">
        <div className="container mx-auto">
          <Link href="/dashboard" passHref>
            <div className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back to Dashboard</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                {videoUrl && !videoError ? (
                  <video 
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    onLoadedData={handleVideoLoad}
                    onTimeUpdate={handleTimeUpdate}
                    onError={handleVideoError}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    crossOrigin="anonymous"
                    preload="metadata"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-300">
                      {videoError ? (
                        <>
                          <p className="mb-4 text-red-400">Video could not be loaded</p>
                          <p className="text-gray-400 text-sm mb-4">
                            Please check if the video file exists in S3
                          </p>
                          <button 
                            onClick={() => {
                              setVideoError(false);
                              if (videoRef.current) {
                                videoRef.current.load();
                              }
                            }}
                            className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded text-sm transition-colors"
                          >
                            Retry
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="mb-4">No video available</p>
                          <p className="text-gray-400 text-sm">This lesson does not have a video yet</p>
                        </>
                      )}
                      {videoUrl && (
                        <p className="text-xs text-gray-500 mt-4 break-all">
                          Video URL: {videoUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Fixed Play Button Overlay - Only shows when paused */}
                {videoUrl && !videoError && !isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              {videoUrl && !videoError && (
                <div className="p-4 bg-gray-100 border-t border-gray-200">
                  <div className="mb-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={progress || 0} 
                      onChange={handleProgressChange}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${progress}%, #d1d5db ${progress}%, #d1d5db 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600 text-sm">{formatTime(currentTime)}</span>
                      <span className="text-gray-600 text-sm">{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={togglePlay}
                        className="text-gray-700 hover:text-blue-500 transition-colors"
                      >
                        {isPlaying ? 
                          <Pause className="w-6 h-6" /> : 
                          <Play className="w-6 h-6" />
                        }
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-700 hover:text-blue-500 transition-colors">
                          {getVolumeIcon()}
                        </button>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume} 
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${volume}%, #d1d5db ${volume}%, #d1d5db 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Removed Settings button, kept only Fullscreen */}
                    <div className="flex items-center">
                      <button 
                        onClick={() => {
                          if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen();
                          }
                        }}
                        className="text-gray-700 hover:text-blue-500 transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {currentVideo?.title || course.title}
              </h2>
              <p className="text-gray-600 mb-2">
                Chapter: {currentChapter?.title || 'Introduction'}
              </p>
              <p className="text-gray-600 mb-4">
                Instructor: {course.instructor || 'Unknown'}
              </p>
              <p className="text-gray-500">{course.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Total Chapters: {course.chapters?.length || 0}</p>
                <p>Course Duration: {course.duration} minutes</p>
                <p>Level: {course.level}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-4 pb-2 border-b border-gray-200">
                Course Content
              </h3>
              
              {course.chapters && course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter, chapterIndex) => (
                    <div key={chapter._id || chapterIndex} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {chapter.title}
                      </h4>
                      {chapter.videos && chapter.videos.length > 0 ? (
                        <ul className="space-y-2">
                          {chapter.videos.map((video, videoIndex) => (
                            <li 
                              key={video._id || videoIndex}
                              className={`p-2 rounded-md cursor-pointer transition-colors ${
                                chapterIndex === currentChapterIndex && videoIndex === currentVideoIndex
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => selectVideo(chapterIndex, videoIndex)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{video.title}</p>
                                  <p className="text-xs opacity-75">
                                    {video.duration ? `${video.duration} min` : 'Duration N/A'}
                                  </p>
                                </div>
                                {chapterIndex === currentChapterIndex && videoIndex === currentVideoIndex && (
                                  <Play className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No videos in this chapter</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No chapters available yet</p>
                  <p className="text-sm mt-2">Course content is being prepared</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}