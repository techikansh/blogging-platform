import React, { useState, useEffect } from 'react';
import { BookmarkCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { postApi } from '../utils/api';
import { adaptPostResponse } from '../utils/adapters';
import { useNavigate } from 'react-router-dom';

const Bookmarks: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Posts state
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationData | null>(null);
  
  // Navigation
  const navigate = useNavigate();
  
  // Fetch bookmarked posts on initial load
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  // Fetch bookmarked posts from API
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await postApi.getBookmarks();
      const adaptedPosts = adaptPostResponse(response);
      setBookmarkedPosts(adaptedPosts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setError('Failed to load bookmarks. Please try again later.');
      showNotification('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };
  
  // Handle post viewing
  const viewPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };
  
  // Handle post liking
  const handleLike = async (id: number) => {
    try {
      await postApi.likePost(id);
      setBookmarkedPosts(bookmarkedPosts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
      
      showNotification("Post liked!");
    } catch (err) {
      console.error('Failed to like post:', err);
      showNotification('Failed to like post', 'error');
    }
  };
  
  // Handle post sharing
  const handleShare = async (id: number) => {
    try {
      await postApi.sharePost(id);
      setBookmarkedPosts(bookmarkedPosts.map(post => 
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      ));
      
      showNotification("Post shared successfully!");
    } catch (err) {
      console.error('Failed to share post:', err);
      showNotification('Failed to share post', 'error');
    }
  };
  
  // Handle post unbookmarking
  const handleRemoveBookmark = async (id: number) => {
    try {
      // This is just visual feedback, the actual API call is the same
      await postApi.bookmarkPost(id);
      
      // Remove the post from the bookmarks list
      setBookmarkedPosts(bookmarkedPosts.filter(post => post.id !== id));
      
      showNotification("Post removed from bookmarks!");
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      showNotification('Failed to remove from bookmarks', 'error');
    }
  };
  
  // Create new post
  const handleNewPost = () => {
    navigate('/create');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      {/* Notification */}
      <Notification 
        notification={notification}
        onClose={() => setNotification(null)}
      />
      
      {/* Header */}
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        onNewPost={handleNewPost}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Bookmarks Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <BookmarkCheck size={32} className="mr-3 text-blue-500" />
            Your Bookmarks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Posts you've saved for later reading
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-100 text-red-800 rounded-lg shadow">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => fetchBookmarks()}
              className="mt-4 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Try Again
            </button>
          </div>
        ) : bookmarkedPosts.length === 0 ? (
          <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
            <BookmarkCheck size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't bookmarked any posts yet. 
              Start reading and bookmark posts you want to save for later!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Discover Posts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                darkMode={darkMode}
                onLike={() => handleLike(post.id)}
                onBookmark={() => handleRemoveBookmark(post.id)}
                onShare={() => handleShare(post.id)}
                onView={() => viewPost(post)}
                isBookmarked={true} // Always true since these are bookmarked posts
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Bookmarks; 