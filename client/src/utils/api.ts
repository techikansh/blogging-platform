import axios from 'axios';
import { Post } from '../types/Post';

const API_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Post API endpoints
export const postApi = {
  // Get all posts or filter by category/tag
  getPosts: async (category?: string, tag?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    
    try {
      const response = await api.get(`/post/get-posts?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  // Create new post
  createPost: async (postData: any) => {
    try {
      const response = await api.post('/post/create-post', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  // Get post by ID
  getPostById: async (postId: number) => {
    try {
      const response = await api.get(`/post/get-post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },
  
  // Get user's bookmarked posts
  getBookmarks: async () => {
    try {
      const response = await api.get('/post/get-bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },
  
  // Like a post
  likePost: async (postId: number) => {
    try {
      const response = await api.post(`/post/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },
  
  // Bookmark a post
  bookmarkPost: async (postId: number) => {
    try {
      const response = await api.post(`/post/bookmark-post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  },
  
  // Share a post
  sharePost: async (postId: number) => {
    try {
      const response = await api.post(`/post/${postId}/share`);
      return response.data;
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }
};

// Auth API endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/authenticate', credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
};

export default api; 