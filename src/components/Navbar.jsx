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
    <header className="bg-gray-900 shadow-lg border-b border-gray-800 fixed w-full z-10 ">
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-400">
            MyLMS
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-gray-300">
            <Link href="/courses" className="hover:text-blue-400 font-medium transition-colors">
              Courses
            </Link>
            <Link href="/subscriptions" className="hover:text-blue-400 font-medium transition-colors">
              Subscriptions
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-400 bg-blue-700 flex items-center justify-center text-white font-medium text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <svg className="w-4 h-4 ml-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                    <Link href="/courses/watch/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
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
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Become a Member
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-blue-400" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-gray-900 border-t border-gray-800">
          <Link href="/courses" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
            Courses
          </Link>
          <Link href="/subscriptions" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
            Subscriptions
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/courses/watch/dashboard" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 text-gray-300 hover:text-blue-400">
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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
