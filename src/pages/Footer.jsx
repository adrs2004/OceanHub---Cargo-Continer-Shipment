import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-4 sm:py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <p className="text-xs sm:text-sm">
              © {new Date().getFullYear()} OceanHub. All rights reserved.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <p className="text-xs sm:text-sm text-center">
              Website created by <span className="text-blue-400 font-medium">Adarsh Kumar Pathak</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;