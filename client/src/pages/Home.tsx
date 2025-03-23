import React, { useState, useEffect } from 'react';
import { Rss } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import FeaturedPostCard from '../components/FeaturedPostCard';
import Filters from '../components/Filters';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { dummyPosts } from '../data/dummyData';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  
  // View state
  const [currentView, setCurrentView] = useState("list"); // list, create, view
  const [activePost, setActivePost] = useState<Post | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Notification state
  const [notification, setNotification] = useState<NotificationData | null>(null);
  
  // Navigation state
  const navigate = useNavigate();
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };
  
  // Handle post liking
  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
    
    if (activePost && activePost.id === id) {
      setActivePost({ ...activePost, likes: activePost.likes + 1 });
    }
  };
  
  // Handle post bookmarking
  const handleBookmark = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, bookmarks: post.bookmarks + 1 } : post
    ));
    
    if (activePost && activePost.id === id) {
      setActivePost({ ...activePost, bookmarks: activePost.bookmarks + 1 });
    }
    
    showNotification("Post saved to bookmarks!");
  };
  
  // Handle post sharing
  const handleShare = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, shares: post.shares + 1 } : post
    ));
    
    if (activePost && activePost.id === id) {
      setActivePost({ ...activePost, shares: activePost.shares + 1 });
    }
    
    showNotification("Post shared successfully!");
  };
  
  // View a specific post
  const viewPost = (post: Post) => {
    setActivePost(post);
    setCurrentView("view");
    window.scrollTo(0, 0);
  };
  
  // Create new post
  const handleNewPost = () => {
    navigate('/create');
  };
  
  // Filter posts by tag
  const filterByTag = (tag: string) => {
    setActiveFilter(tag);
  };
  
  // Filter posts by category
  const filterByCategory = (category: string) => {
    setActiveFilter(category);
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
  };
  
  // Filter and search posts
  const filteredPosts = posts.filter(post => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tag/category filter
    const matchesFilter = activeFilter === "all" || 
      post.tags.includes(activeFilter) ||
      post.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Get featured posts
  const featuredPosts = posts.filter(post => post.featured);
  
  // Get all unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  
  // Get all categories
  const categories = [...new Set(posts.filter(post => post.category).map(post => post.category as string))];

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
        <div>
          {/* Filters section */}
          <Filters
            darkMode={darkMode}
            activeFilter={activeFilter}
            categories={categories}
            tags={allTags}
            onFilterByCategory={filterByCategory}
            onFilterByTag={filterByTag}
            onResetFilters={resetFilters}
          />
          
          {/* Featured posts */}
          {featuredPosts.length > 0 && activeFilter === "all" && !searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Rss size={24} className="mr-2 text-blue-500" /> 
                Featured Stories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map(post => (
                  <FeaturedPostCard
                    key={post.id}
                    post={post}
                    darkMode={darkMode}
                    onView={viewPost}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {activeFilter === "all" ? "Latest Articles" : `Articles: ${activeFilter}`}
              <span className="text-sm font-normal ml-2 text-gray-500">({filteredPosts.length} posts)</span>
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className={`text-center py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
                <p className="text-lg">No posts found matching your criteria.</p>
                <button
                  onClick={resetFilters}
                  className={`mt-4 px-4 py-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    darkMode={darkMode}
                    onView={viewPost}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    onTagClick={filterByTag}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home; 