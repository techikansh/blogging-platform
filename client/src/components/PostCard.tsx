import React from 'react';
import { Heart, MessageSquare, Bookmark, Share2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types/Post';

interface PostCardProps {
  post: Post;
  darkMode: boolean;
  onView: (post: Post) => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onShare: (id: number) => void;
  onTagClick: (tag: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  darkMode, 
  onView, 
  onLike, 
  onBookmark, 
  onShare,
  onTagClick
}) => {
  const navigate = useNavigate();

  const handleReadArticle = () => {
    // First call the onView function to maintain current functionality
    onView(post);
    // Then navigate to the post detail page
    navigate(`/post/${post.id}`);
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow transition-transform hover:translate-y-[-5px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-40 object-cover"
        />
        {post.category && (
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'}`}>
            {post.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className={`mb-3 text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.subtitle || post.content.substring(0, 120) + '...'}
        </p>
        
        <div className={`flex items-center mb-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar size={12} className="mr-1" />
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <Clock size={12} className="mr-1" />
          <span>{post.readTime}</span>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className={`inline-block px-2 py-1 text-xs rounded-full cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              +{post.tags.length - 3}
            </span>
          )}
        </div>
        
        <button
          onClick={handleReadArticle}
          className={`w-full py-2 px-4 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium transition-colors text-sm`}
        >
          Read Article
        </button>
        
        <div className={`mt-4 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
            >
              <Heart size={16} className={`mr-1 ${post.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center text-sm">
              <MessageSquare size={16} className="mr-1" />
              <span>{post.comments}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(post.id);
              }}
            >
              <Bookmark size={16} className={post.bookmarks > 0 ? 'text-blue-500' : ''} />
            </button>
            
            <button 
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onShare(post.id);
              }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 