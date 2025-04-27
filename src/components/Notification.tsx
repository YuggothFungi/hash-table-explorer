import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
  type: NotificationType;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  onClose, 
  isVisible,
  type = 'info'
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: 'Успешно',
          containerClass: 'border-green-500 bg-green-50',
          textClass: 'text-green-800',
          progressClass: 'bg-green-500'
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: 'Ошибка',
          containerClass: 'border-red-500 bg-red-50',
          textClass: 'text-red-800',
          progressClass: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          title: 'Предупреждение',
          containerClass: 'border-yellow-500 bg-yellow-50',
          textClass: 'text-yellow-800',
          progressClass: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          title: 'Информация',
          containerClass: 'border-blue-500 bg-blue-50',
          textClass: 'text-blue-800',
          progressClass: 'bg-blue-500'
        };
    }
  };

  const { icon, title, containerClass, textClass, progressClass } = getTypeStyles();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      <div 
        className={cn(
          "relative w-full max-w-sm rounded-lg border shadow-lg p-4 transition-all animate-in slide-in-from-bottom-5 duration-300",
          containerClass
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className={cn("text-sm font-medium", textClass)}>
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className={cn("text-xs mt-1", textClass)}>
              {message}
            </p>
          </div>
        </div>
        
        {/* Полоса прогресса */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg">
          <div 
            className={cn("h-full animation-toast-progress", progressClass)}
            style={{ animation: "toast-progress 3s linear forwards" }}
          />
        </div>
      </div>
    </div>
  );
}; 