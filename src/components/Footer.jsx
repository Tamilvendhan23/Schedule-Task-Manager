import React from 'react';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Keep track of your daily tasks and goals
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p className="flex items-center justify-center">
            Made with <FaHeart className="text-red-500 mx-1" /> in 2025
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Task Schedule. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;