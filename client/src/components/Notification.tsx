import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface NotificationData {
  message: string;
  type: 'success' | 'error';
}

interface NotificationProps {
  notification: NotificationData | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);
  
  if (!notification) return null;
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between ${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white max-w-md w-full animate-fade-in`}
    >
      <div className="flex items-center">
        {notification.type === 'success' ? (
          <CheckCircle size={20} className="mr-2" />
        ) : (
          <AlertCircle size={20} className="mr-2" />
        )}
        <span>{notification.message}</span>
      </div>
      <button 
        onClick={onClose}
        className="text-white hover:text-gray-200 p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification; 