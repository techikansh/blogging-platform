import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types/Post';

interface FeaturedPostCardProps {
  post: Post;
  darkMode: boolean;
  onView: (post: Post) => void;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post, darkMode, onView }) => {
  const navigate = useNavigate();

  const handleReadArticle = () => {
    // First call the onView function to maintain current functionality
    onView(post);
    // Then navigate to the post detail page
    navigate(`/post/${post.id}`);
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-5px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <img 
        src={post.image} 
        alt={post.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className={`inline-block px-3 py-1 text-xs rounded-full mb-3 ${darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'}`}>
          {post.category}
        </span>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.subtitle}
        </p>
        
        <div className={`flex items-center mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <img 
            src={post.authorAvatar} 
            alt={post.author}
            className="w-8 h-8 rounded-full mr-2" 
          />
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <Calendar size={14} className="mr-1" />
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <Clock size={14} className="mr-1" />
          <span>{post.readTime}</span>
        </div>
        
        <button
          onClick={handleReadArticle}
          className={`w-full py-2 px-4 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium transition-colors`}
        >
          Read Article
        </button>
      </div>
    </div>
  );
};

export default FeaturedPostCard; 