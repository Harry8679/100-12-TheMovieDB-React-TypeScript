import type { ErrorMessageProps } from '../types';

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Oups !
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};