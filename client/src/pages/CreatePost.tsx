import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification, { NotificationData } from '../components/Notification';
import { Post } from '../types/Post';
import { dummyPosts } from '../data/dummyData';
import { RootState } from '../store/store';

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
    author: "",
    tags: "",
    category: "",
    image: null as File | null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Categories
  const categories = ["Programming", "Design", "Technology", "Career", "Productivity"];
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Load post data if editing
  useEffect(() => {
    if (id) {
      const postId = parseInt(id);
      const foundPost = dummyPosts.find(p => p.id === postId);
      
      if (foundPost) {
        setFormData({
          title: foundPost.title,
          subtitle: foundPost.subtitle || "",
          content: foundPost.content,
          author: foundPost.author,
          tags: foundPost.tags.join(', '),
          category: foundPost.category || "",
          image: null
        });
        setIsEditing(true);
      }
    }
  }, [id]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your backend API
    const newPost = {
      id: isEditing && id ? parseInt(id) : dummyPosts.length + 1,
      title: formData.title,
      subtitle: formData.subtitle,
      content: formData.content,
      author: formData.author || (user?.fullname || "Anonymous"),
      authorAvatar: "/api/placeholder/50/50",
      readTime: `${Math.max(1, Math.ceil(formData.content.split(' ').length / 200))} min read`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      likes: 0,
      comments: 0,
      bookmarks: 0,
      shares: 0,
      image: "/api/placeholder/800/400", // In a real app, we'd handle image uploads
      featured: false,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      category: formData.category
    };
    
    // In a real app, this would be API calls to create/update the post
    if (isEditing) {
      // Update post
      showNotification("Post updated successfully!");
    } else {
      // Create new post
      showNotification("Post published successfully!");
    }
    
    // Navigate back to home
    setTimeout(() => {
      navigate('/');
    }, 1500);
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
          <div className="mb-6 flex items-center">
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
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author || (user?.fullname || "")}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="Your name"
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
                Cover Image
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex flex-col items-center justify-center">
                  <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Drag and drop an image, or click to select
                  </p>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Select Image
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                rows={12}
                placeholder="Write your article here..."
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="e.g., Technology, Programming, Web Development"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium flex items-center`}
              >
                <Save size={18} className="mr-2" />
                {isEditing ? "Update Article" : "Publish Article"}
              </button>
              
              <button
                type="button"
                className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium`}
                onClick={() => navigate('/')}
              >
                Cancel
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