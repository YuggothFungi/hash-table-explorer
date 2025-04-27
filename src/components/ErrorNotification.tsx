import React from 'react';

interface ErrorNotificationProps {
  message: string;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return (
    <div className="p-6 rounded-lg border border-destructive bg-destructive/5 shadow-sm">
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="text-destructive h-5 w-5 flex-shrink-0 mt-0.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 className="mb-2 text-base font-medium text-destructive">Ошибка</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}; 