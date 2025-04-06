import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { RootState } from '../store/store';
import { postApi } from '../utils/api';
import { adaptPost } from '../utils/adapters';

const CreatePost: React.FC = () => {
  const { id } = useParams<{id?: string}>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    readTime: "",
    tags: "",
    category: "",
    imageUrl: "",
    featured: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Categories
  const categories = ["Programming", "Design", "Technology", "Career", "Productivity"];
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Load post data if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          setLoading(true);
          // This endpoint would need to be implemented on the server
          // const response = await postApi.getPostById(parseInt(id));
          // const post = adaptPost(response.content[0]);
          
          // For now, using mock approach until endpoint is available
          const response = await postApi.getPosts();
          const posts = response.content || [];
          const foundPost = posts.find(p => p.id === parseInt(id));
          
          if (foundPost) {
            const post = adaptPost(foundPost);
            setFormData({
              title: post.title,
              subtitle: post.subtitle || "",
              content: post.content,
              readTime: post.readTime,
              tags: post.tags.join(', '),
              category: post.category || "",
              imageUrl: post.imageUrl,
              featured: post.featured
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          showNotification('Failed to load post data', 'error');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [id]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare post data for API
      const postData = {
        title: formData.title,
        subtitle: formData.subtitle,
        content: formData.content,
        readTime: formData.readTime || `${Math.max(1, Math.ceil(formData.content.split(' ').length / 200))} min read`,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        featured: formData.featured,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        likes: 0,
        bookmarks: 0,
        shares: 0
      };
      
      // Create or update post
      const response = await postApi.createPost(postData);
      
      if (response.success) {
        showNotification(isEditing ? "Post updated successfully!" : "Post published successfully!");
        
        // Navigate back to home
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      showNotification('Failed to save post', 'error');
    } finally {
      setLoading(false);
    }
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
        onNewPost={() => {}}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-4 text-blue-500 hover:text-blue-600"
                onClick={() => navigate('/')}
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h2>
            </div>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Enter an engaging title"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="A brief description of your article"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g. 5 min read"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Separate tags with commas (e.g. JavaScript, React, Tutorial)"
              />
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Separate tags with commas
              </p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm">
                Mark as featured
              </label>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Write your article here..."
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`mr-4 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                <Save size={18} className="mr-2" />
                {isEditing ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default CreatePost; 