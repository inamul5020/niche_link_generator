
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
      <strong className="font-bold">An error occurred</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
