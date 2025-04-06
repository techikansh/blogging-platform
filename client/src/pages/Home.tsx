import React, { useState, useEffect } from 'react';
import { Rss } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import FeaturedPostCard from '../components/FeaturedPostCard';
import Filters from '../components/Filters';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../utils/api';
import { adaptPostResponse } from '../utils/adapters';

const Home: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts for categories/tags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Fetch all posts on initial load
  useEffect(() => {
    fetchAllPosts();
  }, []);
  
  // Fetch posts when filter changes
  useEffect(() => {
    if (activeFilter !== "all" && !searchQuery) {
      const isCategory = !allTags.includes(activeFilter);
      fetchPosts(isCategory ? activeFilter : undefined, isCategory ? undefined : activeFilter);
    }
  }, [activeFilter]);
  
  // Fetch all posts from API (for maintaining categories and tags)
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await postApi.getPosts();
      const adaptedPosts = adaptPostResponse(response);
      setAllPosts(adaptedPosts);
      setPosts(adaptedPosts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
      showNotification('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch filtered posts from API
  const fetchPosts = async (category?: string, tag?: string) => {
    try {
      setLoading(true);
      
      if (!category && !tag) {
        // If no filters, use all posts
        setPosts(allPosts);
      } else {
        // Fetch filtered posts
        const response = await postApi.getPosts(category, tag);
        const adaptedPosts = adaptPostResponse(response);
        setPosts(adaptedPosts);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
      showNotification('Failed to load posts', 'error');
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
  
  // Handle post liking
  const handleLike = async (id: number) => {
    try {
      await postApi.likePost(id);
      setPosts(posts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
      
      // Also update in allPosts
      setAllPosts(allPosts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
      
      if (activePost && activePost.id === id) {
        setActivePost({ ...activePost, likes: activePost.likes + 1 });
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      showNotification('Failed to like post', 'error');
    }
  };
  
  // Handle post bookmarking
  const handleBookmark = async (id: number) => {
    try {
      await postApi.bookmarkPost(id);
      setPosts(posts.map(post => 
        post.id === id ? { ...post, bookmarks: post.bookmarks + 1 } : post
      ));
      
      // Also update in allPosts
      setAllPosts(allPosts.map(post => 
        post.id === id ? { ...post, bookmarks: post.bookmarks + 1 } : post
      ));
      
      if (activePost && activePost.id === id) {
        setActivePost({ ...activePost, bookmarks: activePost.bookmarks + 1 });
      }
      
      showNotification("Post saved to bookmarks!");
    } catch (err) {
      console.error('Failed to bookmark post:', err);
      showNotification('Failed to bookmark post', 'error');
    }
  };
  
  // Handle post sharing
  const handleShare = async (id: number) => {
    try {
      await postApi.sharePost(id);
      setPosts(posts.map(post => 
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      ));
      
      // Also update in allPosts
      setAllPosts(allPosts.map(post => 
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      ));
      
      if (activePost && activePost.id === id) {
        setActivePost({ ...activePost, shares: activePost.shares + 1 });
      }
      
      showNotification("Post shared successfully!");
    } catch (err) {
      console.error('Failed to share post:', err);
      showNotification('Failed to share post', 'error');
    }
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
    // When filter changes, make an API call to get filtered posts
    fetchPosts(undefined, tag);
  };
  
  // Filter posts by category
  const filterByCategory = (category: string) => {
    setActiveFilter(category);
    // When filter changes, make an API call to get filtered posts
    fetchPosts(category);
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    // Use all posts when resetting filters
    setPosts(allPosts);
  };
  
  // Filter and search posts
  const filteredPosts = posts.filter(post => {
    // If active filter is set via API call, don't filter again
    if (activeFilter !== "all" && !searchQuery) {
      return true;
    }
    
    // Search filter
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tag/category filter (only applied if not already filtered via API)
    const matchesFilter = activeFilter === "all" || 
      post.tags.includes(activeFilter) ||
      post.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Get featured posts
  const featuredPosts = allPosts.filter(post => post.featured);
  
  // Get all unique tags from all posts
  const allTags = [...new Set(allPosts.flatMap(post => post.tags))];
  
  // Get all categories from all posts
  const categories = [...new Set(allPosts.filter(post => post.category).map(post => post.category as string))];

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-100 text-red-800 rounded-lg shadow">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => fetchAllPosts()}
              className="mt-4 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      darkMode={darkMode}
                      onLike={() => handleLike(post.id)}
                      onBookmark={() => handleBookmark(post.id)}
                      onShare={() => handleShare(post.id)}
                      onView={viewPost}
                      onTagClick={filterByTag}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home; 