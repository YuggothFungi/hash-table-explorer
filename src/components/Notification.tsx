import React from 'react';

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
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-green-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          ),
          title: 'Успешно',
          buttonColor: 'bg-green-500 hover:bg-green-600'
        };
      case 'error':
        return {
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-red-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: 'Ошибка',
          buttonColor: 'bg-red-500 hover:bg-red-600'
        };
      case 'warning':
        return {
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-yellow-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Предупреждение',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'info':
      default:
        return {
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-blue-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Информация',
          buttonColor: 'bg-blue-500 hover:bg-blue-600'
        };
    }
  };

  const { icon, title, buttonColor } = getTypeStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm pl-7">{message}</p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-3 py-1.5 text-sm text-white rounded transition-colors ${buttonColor}`}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}; 