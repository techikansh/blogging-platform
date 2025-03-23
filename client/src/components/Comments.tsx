import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { Comment } from '../types/Comment';

interface CommentsProps {
  darkMode: boolean;
  comments: Comment[];
  postId: number;
  onAddComment: (postId: number, commentText: string) => void;
  onLikeComment: (commentId: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ 
  darkMode, 
  comments, 
  postId, 
  onAddComment, 
  onLikeComment 
}) => {
  const [commentText, setCommentText] = useState("");
  
  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(postId, commentText);
    setCommentText("");
  };
  
  return (
    <div className={`border-t px-6 py-8 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="text-xl font-bold mb-6">
        Comments ({comments.length})
      </h3>
      
      <div className="mb-8">
        <div className="flex gap-3">
          <img 
            src="/api/placeholder/40/40" 
            alt="Your Avatar"
            className="w-10 h-10 rounded-full" 
          />
          <div className="flex-1">
            <textarea
              placeholder="Add your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button 
                className={`px-4 py-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center disabled:opacity-50`}
                onClick={handleSubmit}
                disabled={!commentText.trim()}
              >
                <Send size={16} className="mr-2" /> Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt={comment.author}
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {comment.date}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="mt-3 mb-3">{comment.content}</p>
              
              <div className="flex items-center">
                <button 
                  className="flex items-center text-sm mr-4"
                  onClick={() => onLikeComment(comment.id)}
                >
                  <Heart size={14} className={`mr-1 ${comment.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
                <button className="text-sm">Reply</button>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Be the first to comment on this article!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 