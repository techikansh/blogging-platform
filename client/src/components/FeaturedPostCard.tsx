import React from 'react';
import { Post } from '../types/Post';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface FeaturedPostCardProps {
  post: Post;
  darkMode: boolean;
  onView: (post: Post) => void;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post, darkMode, onView }) => {
  // Format author name
  const authorName = post.author ? 
    `${post.author.firstName} ${post.author.lastName}` : 
    'Unknown Author';
    
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform hover:translate-y-[-5px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      onClick={() => onView(post)}
    >
      <div className="relative h-60 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {post.category && (
          <span className={`inline-block px-3 py-1 mb-2 text-xs font-medium rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'}`}>
            {post.category}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
        
        <div className="flex items-center text-xs text-white/80 mb-3">
          <Calendar size={12} className="mr-1" />
          <span>{post.createdDate}</span>
          <span className="mx-2">•</span>
          <Clock size={12} className="mr-1" />
          <span>{post.readTime}</span>
        </div>
        
        <button 
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={(e) => {
            e.stopPropagation();
            onView(post);
          }}
        >
          Read Article <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedPostCard; 