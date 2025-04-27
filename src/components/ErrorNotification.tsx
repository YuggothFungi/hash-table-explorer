import React from 'react';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ 
  message, 
  onClose, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center mb-3">
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
          <h3 className="text-md font-semibold text-gray-900">Ошибка</h3>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm pl-7">{message}</p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}; 