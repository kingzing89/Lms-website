// components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

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
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      console.error("Logout failed:", result.message);
    }
  };

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-800 fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              MyLMS
            </Link>
          </div>

          {/* Navigation Links - Always visible on desktop */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-8 text-gray-300">
              <Link href="/courses" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
                Courses
              </Link>
              <Link href="/subscriptions" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
                Subscriptions
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Auth buttons - Always visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 bg-blue-700 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </span>
                  </div>
                  <svg 
                    className="w-4 h-4 ml-1 text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Dashboard
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
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
                  className="text-gray-100 px-4 py-2 hover:text-blue-400 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-800">
            {/* Always show navigation links in mobile menu */}
            <Link 
              href="/courses" 
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              Courses
            </Link>
            <Link 
              href="/subscriptions" 
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              Subscriptions
            </Link>
            
            {/* Conditionally show auth-related links */}
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}