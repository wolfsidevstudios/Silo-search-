import React, { useEffect } from 'react';
import type { WebSearchResult } from '../types';

interface CreativeViewProps {
  result: WebSearchResult | null;
  error: string | null;
  onComplete: () => void;
  onNewSearch: () => void;
}

const CreativeView: React.FC<CreativeViewProps> = ({ result, error, onComplete, onNewSearch }) => {

  useEffect(() => {
    if (result || error) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Small delay to show completion before navigating
      return () => clearTimeout(timer);
    }
  }, [result, error, onComplete]);

  if (error) {
    return (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={onNewSearch} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Try Again
            </button>
        </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-white">
      <div className="text-center">
            <img 
                src="https://i.ibb.co/gZCdj72w/IMG-3618.png" 
                alt="Loading Animation" 
                className="w-24 h-24 rounded-2xl shadow-lg mx-auto mb-8"
            />
            <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="font-medium text-lg">Generating content...</p>
            </div>
        </div>
    </div>
  );
};

export default CreativeView;