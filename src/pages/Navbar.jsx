import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  return (
    <nav className="bg-black text-white fixed w-full z-20 top-0 left-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-tight"
              onClick={() => setActiveLink('home')}
            >
              <span className="text-white">Ocean</span>
              <span className="text-blue-400">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeLink === 'home' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setActiveLink('home')}
            >
              Home
              {activeLink === 'home' && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400"></span>
              )}
            </Link>
            <Link 
              to="/services" 
              className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeLink === 'services' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setActiveLink('services')}
            >
              Services
              {activeLink === 'services' && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400"></span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeLink === 'home' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            onClick={() => {
              setIsOpen(false);
              setActiveLink('home');
            }}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeLink === 'services' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            onClick={() => {
              setIsOpen(false);
              setActiveLink('services');
            }}
          >
            Services
          </Link>
        </div>
      )}
    </nav>
  );
}