export interface Post {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  date: string;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  image: string;
  featured: boolean;
  tags: string[];
  category?: string;
} 