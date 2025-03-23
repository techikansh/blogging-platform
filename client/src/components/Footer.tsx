import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-8 mt-16 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">
              <span className="text-blue-500">Write</span>Wave
            </h2>
            <p className="text-sm mt-1">A modern blogging platform built as a hobby project for my portfolio</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 mb-6 md:mb-0 items-center">
            <Link to="/about" className="hover:text-blue-500">About</Link>
            <Link to="/contact" className="hover:text-blue-500">Contact</Link>
            <a href="#" className="hover:text-blue-500">Privacy Policy</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://github.com/yourusername" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/yourusername" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} />
            </a>
            <a href="mailto:your.email@example.com" className="hover:text-blue-500">
              <Mail size={20} />
            </a>
            <a href="https://yourportfolio.com" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer">
              <Globe size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm">
          <p>© {currentYear} WriteWave by Your Name. Built with React, TypeScript, and Tailwind CSS.</p>
          <p className="mt-1">This is a portfolio project and not a commercial product.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 