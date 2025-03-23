import React, { useState } from 'react';
import { Search, Moon, Sun, LogOut, User, Menu, X, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/AuthSlice';
import { RootState } from '../store/store';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onNewPost: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onNewPost }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.fullname || "Anonymous User";
  
  // Generate initials from userName
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(userName);
  
  const handleNewPost = () => {
    onNewPost();
    navigate('/create');
  };

  return (
    <header className={`sticky top-0 z-30 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-blue-500">Write</span>Wave
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className={`w-64 pl-10 pr-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              className={`px-4 py-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center`}
              onClick={handleNewPost}
            >
              <Plus size={18} className="mr-1" /> New Post
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white font-medium`}>
                {initials}
              </div>
              
              <button 
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => {
                  dispatch(logout());
                  navigate('/login');
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white font-medium`}>
              {initials}
            </div>
            
            <button
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} py-4 px-4 shadow-md`}>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search articles..."
              className={`w-full pl-10 pr-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <button
              className={`px-4 py-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center justify-center`}
              onClick={() => {
                handleNewPost();
                setMobileMenuOpen(false);
              }}
            >
              <Plus size={18} className="mr-1" /> New Post
            </button>
            
            <button
              className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center`}
              onClick={toggleDarkMode}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
              {darkMode ? <Sun size={18} className="ml-2" /> : <Moon size={18} className="ml-2" />}
            </button>
            
            <button
              className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center`}
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
            >
              <LogOut size={18} className="mr-1" /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 