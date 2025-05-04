// pages/index.js
import {useEffect } from 'react';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Learn Tech Skills to ";
  const blueText = "Advance Your Career";

  useEffect(() => {
    if (window.location.hash) {
      window.location.hash = ''; // Reset hash to prevent scrolling
    }
    // This ensures the effect runs only on the client-side
    if (typeof window !== 'undefined') {
      let timer;
      // First type the regular text
      if (displayText.length < fullText.length && isTyping) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, 100);
      } 
      // Then type the highlighted text
      else if (highlightedText.length < blueText.length && isTyping) {
        timer = setTimeout(() => {
          setHighlightedText(blueText.substring(0, highlightedText.length + 1));
        }, 100);
      } else {
        setIsTyping(false);
      }

      return () => clearTimeout(timer);
    }
  }, [displayText, highlightedText, isTyping]);

  // Define the feature cards content
  const featureCards = [
    {
      title: "Expert Instructors",
      description: "Learn from experienced professionals with real-world expertise.",
      icon: (
        <svg className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 5.69 2.271a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3z" />
          <path d="M13.941 13.941A7.002 7.002 0 0114 10c0-1.94-.79-3.7-2.06-4.94l-1.42 1.42A5.004 5.004 0 0012 10c0 1.38-.56 2.63-1.46 3.54l1.4 1.4zM10 15c3.31 0 6-2.69 6-6 0-1.01-.25-1.97-.7-2.8L14.2 7.3c.29.58.45 1.24.45 1.93 0 2.38-1.94 4.32-4.32 4.32-.69 0-1.35-.16-1.93-.45l-1.1 1.1c.83.45 1.79.7 2.8.7z" />
        </svg>
      ),
      backContent: "Our instructors have an average of 8+ years of industry experience. They've worked at top tech companies like Google, Amazon, and Microsoft, bringing real-world insights directly to you."
    },
    {
      title: "Practical Projects",
      description: "Build real-world applications and expand your portfolio.",
      icon: (
        <svg className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ),
      backContent: "Every course includes at least 5 hands-on projects that simulate real workplace challenges. You'll graduate with portfolio-ready projects that demonstrate your skills to potential employers."
    },
    {
      title: "Community Support",
      description: "Join a community of learners and get help when you need it.",
      icon: (
        <svg className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      backContent: "Access our 24/7 community forum with over 50,000 active learners. Get code reviews, mentorship opportunities, and participate in weekly coding challenges with peers from around the world."
    }
  ];

  return (
    <div className="font-sans bg-gray-900 text-gray-100">
      <Head>
        <title>MyLMS - Online Learning Platform</title>
        <meta
          name="description"
          content="Learn tech skills with practical courses"
        />
        <style>{`
          /* Add flip card animations */
          .flip-card {
            perspective: 1000px;
            height: 100%;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-radius: 0.5rem;
          }
          .flip-card-back {
            transform: rotateY(180deg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1.5rem;
          }
        `}</style>
      </Head>

      {/* Navbar */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-800 fixed w-full z-10">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold text-blue-400">MyLMS</div>

{/* Desktop Navigation */}
<ul className="hidden md:flex space-x-8 text-gray-300">
  <li>
    <Link href="/courses" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide relative group">
      Courses
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  </li>

  <li>
    <Link href="/subscriptions" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide relative group">
      Subscriptions
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  </li>
  {/* <li>
    <Link href="/contact" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide relative group">
      Contact
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  </li> */}
</ul>

{/* Mobile Navigation */}
{isMenuOpen && (
  <div className="md:hidden border-t border-gray-800">
    <ul className="bg-gray-900 py-3">
      <li className="block px-6 py-2">
        <Link href="/courses" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
          Courses
        </Link>
      </li>
      <li className="block px-6 py-2">
        <Link href="#paths" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
          Learning Paths
        </Link>
      </li>
      <li className="block px-6 py-2">
        <Link href="#testimonials" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
          Testimonials
        </Link>
      </li>
      {/* <li className="block px-6 py-2">
        <Link href="#contact" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
          Contact
        </Link>
      </li> */}
      <li className="block px-6 py-2">
        <Link
          href="/register"
          className="inline-block bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 font-medium tracking-wide shadow-md hover:shadow-lg"
        >
          Sign Up
        </Link>
      </li>
    </ul>
  </div>
)}

          {/* Sign In button */}
          <Link href={'/register'}>
          <div className="hidden md:block bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600">
              Become a Member
          </div>
          </Link>
          
        </nav>
        

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <ul className="bg-gray-900 py-3">
              <li className="block px-6 py-2">
                <a href="#courses" className="hover:text-blue-400">
                  Courses
                </a>
              </li>
              <li className="block px-6 py-2">
                <a href="#paths" className="hover:text-blue-400">
                  Learning Paths
                </a>
              </li>
              <li className="block px-6 py-2">
                <a href="#testimonials" className="hover:text-blue-400">
                  Testimonials
                </a>
              </li>
              {/* <li className="block px-6 py-2">
                <a href="#contact" className="hover:text-blue-400">
                  Contact
                </a>
              </li> */}
              <li className="block px-6 py-2">
                <a
                  href="/register"
                  className="inline-block bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-48 pb-48 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4 text-gray-100 drop-shadow-lg">
                {displayText}
                <span className="text-blue-400">{highlightedText}</span>
                <span className="inline-block w-1 h-8 bg-blue-400 ml-1 animate-pulse"></span>
              </h1>
              <p className="text-gray-300 mb-6 drop-shadow">
                Practical courses taught by industry experts to help you master
                in-demand skills.
              </p>
              <div className="flex space-x-4">
                <a
                  href="/courses"
                  className="bg-blue-500 text-gray-100 px-5 py-2 rounded-md hover:bg-blue-600"
                >
                  Browse Courses
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Flippable Cards */}
      <section className="py-32 bg-gradient-to-b from-indigo-900 to-blue-900">
  <div className="container mx-auto px-6 min-h-40 flex flex-col justify-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {featureCards.map((card, index) => (
        <div key={index} className="flip-card h-96">
          <div className="flip-card-inner">
            {/* Front of card */}
            <div className="flip-card-front p-8 bg-gray-900 rounded-lg border border-indigo-500 flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="text-4xl text-blue-400 mb-6">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{card.title}</h3>
              <p className="text-gray-300 text-lg">
                {card.description}
              </p>
            </div>
            
            {/* Back of card */}
            <div className="flip-card-back bg-blue-700 border border-blue-400 text-white p-8 rounded-lg shadow-lg shadow-blue-500/20">
              <p className="text-xl">{card.backContent}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Courses Section - Updated with new background color */}
      <section id="courses" className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">Popular Courses</h2>
            <a href="/all-courses" className="text-blue-400 hover:underline">
              View All →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Web Development Bootcamp",
                level: "Beginner",
                rating: 4.9,
                students: 2453,
                price: "$49.99",
              },
              {
                title: "JavaScript Mastery",
                level: "Intermediate",
                rating: 4.8,
                students: 1897,
                price: "$39.99",
              },
              {
                title: "Data Science Fundamentals",
                level: "Beginner",
                rating: 4.7,
                students: 1532,
                price: "$59.99",
              },
            ].map((course, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-purple-700 hover:border-purple-500"
              >
                <div className="h-40 bg-gray-700"></div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm text-gray-300">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-100">{course.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">
                      {course.price}
                    </span>
                    <a
                      href={`/course/${i}`}
                      className="text-blue-400 hover:underline"
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-gray-100">What Our Students Say</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-100">Student Name</h4>
                    <p className="text-sm text-gray-400">Web Developer</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The courses were incredibly practical and helped me land my
                  dream job as a developer. The instructors explain complex
                  concepts in an easy-to-understand way."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-6">
            Join thousands of students already learning on our platform.
          </p>
          <a
            href="#courses"
            className="bg-gray-900 text-gray-100 px-6 py-2 rounded-md hover:bg-gray-800 inline-block"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300 mb-6">
            Have questions? We're here to help.
          </p>
          <a
            href="mailto:support@mylms.com"
            className="text-blue-400 font-medium hover:underline"
          >
            support@mylms.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-gray-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-100">MyLMS</h3>
              <p className="text-gray-400">
                Helping students master tech skills and transform their careers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-100">Quick Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li>
                  <a href="#courses" className="hover:text-gray-100">
                    All Courses
                  </a>
                </li>
                <li>
                  <a href="#paths" className="hover:text-gray-100">
                    Learning Paths
                  </a>
                </li>
                {/* <li>
                  <a href="#contact" className="hover:text-gray-100">
                    Contact
                  </a>
                </li> */}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-100">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-100">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-100">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-100">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} MyLMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}