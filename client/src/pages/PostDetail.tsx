import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Bookmark, Share2, Edit3, Trash2, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Comments from '../components/Comments';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { postApi } from '../utils/api';
import { adaptPostResponse } from '../utils/adapters';

const PostDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Post and comments state
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationData | null>(null);
  
  // Load post data
  useEffect(() => {
    if (id) {
      fetchPostById(parseInt(id));
    }
  }, [id]);
  
  // Fetch post by ID
  const fetchPostById = async (postId: number) => {
    try {
      setLoading(true);
      const response = await postApi.getPostById(postId);
      const adaptedPosts = adaptPostResponse(response);
      
      if (adaptedPosts.length > 0) {
        setPost(adaptedPosts[0]);
        
        // TODO: Replace with actual API calls when comment endpoints are available
        // For now, we'll use empty comments
        setComments([]);
        
        // TODO: Fetch related posts when that API is available
        setRelatedPosts([]);
      } else {
        setError('Post not found');
        showNotification('Post not found', 'error');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError('Failed to load post. Please try again later.');
      showNotification('Failed to load post', 'error');
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
  
  // Handle new post creation
  const handleNewPost = () => {
    navigate('/create');
  };
  
  // Handle post liking
  const handleLike = async () => {
    if (post) {
      try {
        await postApi.likePost(post.id);
        setPost({ ...post, likes: post.likes + 1 });
        showNotification("Post liked!");
      } catch (err) {
        console.error('Failed to like post:', err);
        showNotification('Failed to like post', 'error');
      }
    }
  };
  
  // Handle post bookmarking
  const handleBookmark = async () => {
    if (post) {
      try {
        await postApi.bookmarkPost(post.id);
        setPost({ ...post, bookmarks: post.bookmarks + 1 });
        showNotification("Post saved to bookmarks!");
      } catch (err) {
        console.error('Failed to bookmark post:', err);
        showNotification('Failed to bookmark post', 'error');
      }
    }
  };
  
  // Handle post sharing
  const handleShare = async () => {
    if (post) {
      try {
        await postApi.sharePost(post.id);
        setPost({ ...post, shares: post.shares + 1 });
        showNotification("Post shared successfully!");
      } catch (err) {
        console.error('Failed to share post:', err);
        showNotification('Failed to share post', 'error');
      }
    }
  };
  
  // Handle editing
  const handleEdit = () => {
    if (post) {
      navigate(`/edit/${post.id}`);
    }
  };
  
  // Handle post deletion
  const handleDelete = () => {
    // TODO: Implement delete functionality when API is available
    showNotification("Post deleted successfully!");
    navigate('/');
  };
  
  // Add comment
  const handleAddComment = (postId: number, content: string) => {
    // TODO: Implement comment creation when API is available
    const newComment: Comment = {
      id: comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1,
      postId,
      author: "You",
      content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      likes: 0
    };
    
    setComments([...comments, newComment]);
    
    if (post) {
      setPost({ ...post, comments: post.comments + 1 });
    }
    
    showNotification("Comment added successfully!");
  };
  
  // Like a comment
  const handleLikeComment = (commentId: number) => {
    // TODO: Implement comment like when API is available
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };
  
  // View a related post
  const viewRelatedPost = (postId: number) => {
    navigate(`/post/${postId}`);
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          onNewPost={handleNewPost}
        />
        <main className="max-w-6xl mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          onNewPost={handleNewPost}
        />
        <main className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Post not found'}</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Back to Home
          </button>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <button 
              className="mb-4 text-blue-500 hover:text-blue-600 flex items-center"
              onClick={() => navigate('/')}
            >
              <ChevronLeft size={20} className="mr-1" /> Back to all posts
            </button>
            
            <article className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                {post.category && (
                  <span className={`inline-block px-3 py-1 text-xs rounded-full mb-4 ${darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'}`}>
                    {post.category}
                  </span>
                )}
                
                <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
                
                {post.subtitle && (
                  <p className={`text-xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {post.subtitle}
                  </p>
                )}
                
                <div className={`flex items-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white font-medium`}>
                    {post.author?.firstName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-medium">{post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous'}</p>
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>{post.createdDate}</span>
                      <span className="mx-2">•</span>
                      <Clock size={14} className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`prose max-w-none mb-8 ${darkMode ? 'prose-invert' : ''}`}>
                  {post.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="mb-6">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-block px-3 py-1 text-sm rounded-full mr-2 mb-2 cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      onClick={() => navigate(`/?tag=${tag}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className={`flex items-center justify-between border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-4">
                    <button 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={handleLike}
                    >
                      <Heart size={18} className={post.likes > 0 ? 'text-red-500 fill-red-500' : ''} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={handleBookmark}
                    >
                      <Bookmark size={18} className={post.bookmarks > 0 ? 'text-blue-500 fill-blue-500' : ''} />
                      <span>{post.bookmarks}</span>
                    </button>
                    
                    <button 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={handleShare}
                    >
                      <Share2 size={18} />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className={`px-4 py-2 rounded-full ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white flex items-center`}
                      onClick={handleEdit}
                    >
                      <Edit3 size={16} className="mr-1" /> Edit
                    </button>
                    
                    <button 
                      className={`px-4 py-2 rounded-full ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white flex items-center`}
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Comments section */}
              <Comments
                darkMode={darkMode}
                comments={comments}
                postId={post.id}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            </article>
          </div>
          
          <div className="md:col-span-4">
            {/* Author card */}
            <div className={`rounded-lg shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4">About the Author</h3>
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full mr-4 flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white text-xl font-medium`}>
                  {post.author?.firstName?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-lg">{post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous'}</p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Content Creator
                  </p>
                </div>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Professional writer specializing in {post.category || "various topics"} with over 5 years of experience in digital content creation.
              </p>
              <button className={`w-full py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium`}>
                View Profile
              </button>
            </div>
            
            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map(relatedPost => (
                    <div 
                      key={relatedPost.id} 
                      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      onClick={() => viewRelatedPost(relatedPost.id)}
                    >
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title}
                        className="w-16 h-16 rounded object-cover" 
                      />
                      <div>
                        <h4 className="font-medium line-clamp-2">{relatedPost.title}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {relatedPost.readTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default PostDetail; 