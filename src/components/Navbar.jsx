// components/Navbar.jsx
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-800 fixed w-full z-10">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* <div className="text-2xl font-bold text-blue-400">MyLMS</div> */}
        <Link href="/" className="text-2xl font-bold text-blue-400">
           MyLMS
        </Link>

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
         
          <li>
            <Link href="/contact" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide relative group">
              Contact
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-blue-400"
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

        {/* Sign In button */}
        <div className="hidden md:block">
          <a
            href="/register"
            className="bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Become a Member
          </a>
        </div>
      </nav>

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
            <li className="block px-6 py-2">
              <Link href="#contact" className="hover:text-blue-400 transition-colors duration-300 font-medium tracking-wide">
                Contact
              </Link>
            </li>
            <li className="block px-6 py-2">
              <Link
                href="/register"
                className="inline-block bg-blue-500 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 font-medium tracking-wide shadow-md hover:shadow-lg"
              >
                Become a Member
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}