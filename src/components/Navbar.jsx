import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import  FinalImage  from '../../public/final.png';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      console.error('Logout failed:', result.message);
    }
  };

  return (
    <header className="bg-peach-100/80 backdrop-blur-md shadow-lg border-b border-purple-200/30 fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            <div className="h-12 w-auto flex items-center justify-center overflow-hidden">
              <Image
                src={FinalImage}
                alt="TechTutor365 Logo"
                width={250}
                height={60}
                className="h-70 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/courses"
              className="hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/subscriptions"
              className="hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Subscriptions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <svg
                    className="w-4 h-4 ml-1 text-gray-600 group-hover:text-purple-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl py-2 z-20 border border-purple-200/30">
                    <Link
                      href="/courses/watch/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-purple-200/30 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 px-4 py-2 hover:text-purple-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  Become a Member
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white/90 backdrop-blur-md border-t border-purple-200/30">
          <Link
            href="/courses"
            className="block px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
          >
            Courses
          </Link>
          <Link
            href="/subscriptions"
            className="block px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
          >
            Subscriptions
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/courses/watch/dashboard"
                className="block px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-3 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg text-center font-medium"
              >
                Become a Member
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}