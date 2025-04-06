export interface Post {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  readTime: string;
  createdDate: string;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  imageUrl: string;
  featured: boolean;
  tags: string[];
  category?: string;
}

export interface PostResponse {
  success: boolean;
  message?: string;
  content: Post[] | null;
} 