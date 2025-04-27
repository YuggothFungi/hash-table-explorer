import React from 'react';
import { cn } from '../lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

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
  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: 'Успешно',
          containerClass: 'border-green-500 bg-green-50',
          textClass: 'text-green-800',
          buttonClass: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: 'Ошибка',
          containerClass: 'border-red-500 bg-red-50',
          textClass: 'text-red-800',
          buttonClass: 'bg-red-500 hover:bg-red-600 text-white'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          title: 'Предупреждение',
          containerClass: 'border-yellow-500 bg-yellow-50',
          textClass: 'text-yellow-800',
          buttonClass: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          title: 'Информация',
          containerClass: 'border-blue-500 bg-blue-50',
          textClass: 'text-blue-800',
          buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
    }
  };

  const { icon, title, containerClass, textClass, buttonClass } = getTypeStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className={cn(
        "relative w-full max-w-md rounded-lg border shadow-lg p-6 transition-all",
        containerClass
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className={cn("text-base font-medium mb-1", textClass)}>
              {title}
            </h3>
            <p className={cn("text-sm", textClass)}>
              {message}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              buttonClass
            )}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}; 