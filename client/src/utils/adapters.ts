import { Post, PostResponse } from '../types/Post';

// Transform backend post data to match client-side format
export const adaptPost = (post: any): Post => {
  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle || '',
    content: post.content,
    author: post.author || { 
      id: 0, 
      firstName: 'Unknown',
      lastName: 'Author',
      email: '',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' 
    },
    readTime: post.readTime || '5 min read',
    createdDate: new Date(post.createdDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    likes: post.likes || 0,
    comments: 0, // Comments count might need to be fetched separately
    bookmarks: post.bookmarks || 0,
    shares: post.shares || 0,
    imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    featured: post.featured || false,
    tags: post.tags ? post.tags.map((tag: any) => tag.name) : [],
    category: post.category || ''
  };
};

// Transform the entire response
export const adaptPostResponse = (response: PostResponse): Post[] => {
  if (!response.success || !response.content) {
    return [];
  }
  
  return response.content.map(post => adaptPost(post));
}; 