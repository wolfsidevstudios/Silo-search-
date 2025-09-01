import React, { useState, useEffect } from 'react';
import type { WebSearchResult } from '../types';
import { CheckCircleIcon } from './icons';

interface DeepResearchViewProps {
  query: string;
  result: WebSearchResult | null;
  error: string | null;
  onComplete: () => void;
  onNewSearch: () => void;
}

const DeepResearchView: React.FC<DeepResearchViewProps> = ({ query, result, error, onComplete, onNewSearch }) => {
  const sources = result?.sources || [];
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (result) {
      if (sources.length === 0) {
        const doneTimeout = setTimeout(() => setIsDone(true), 500);
        const completeTimeout = setTimeout(() => onComplete(), 1500);
        return () => {
          clearTimeout(doneTimeout);
          clearTimeout(completeTimeout);
        };
      }

      const totalDurationMs = sources.length * 300 + 1500;
      
      const doneTimeout = setTimeout(() => {
        setIsDone(true);
      }, totalDurationMs - 1000);

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, totalDurationMs);

      return () => {
        clearTimeout(doneTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [result, sources.length, onComplete]);

  const renderContent = () => {
    if (error) {
        return (
            <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={onNewSearch} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Try Again
                </button>
            </div>
        );
    }

    if (isDone) {
        return (
             <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-500">
                <CheckCircleIcon className="w-16 h-16 text-green-500"/>
                <h2 className="text-3xl font-bold text-gray-800">Research Complete!</h2>
                <p className="text-gray-600">Finalizing results...</p>
            </div>
        );
    }
    
    return (
        <div className="text-center">
            <img 
                src="https://i.ibb.co/gZCdj72w/IMG-3618.png" 
                alt="Loading Animation" 
                className="w-24 h-24 rounded-2xl shadow-lg mx-auto mb-8"
            />
            <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="font-medium text-lg">Performing deep research...</p>
            </div>
        </div>
    );
  };


  return (
    <div className="flex-grow flex justify-center items-center p-4 sm:p-6 lg:p-8 bg-white">
        {renderContent()}
    </div>
  );
};

export default DeepResearchView;