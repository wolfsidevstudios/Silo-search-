import React, { useState, useEffect } from 'react';
import type { WebSearchResult } from '../types';
import { ClockIcon, CheckIcon, CheckCircleIcon } from './icons';

interface BrowsingViewProps {
  query: string;
  result: WebSearchResult | null;
  isLoading: boolean;
  error: string | null;
  onComplete: () => void;
  onNewSearch: () => void;
}

const BrowsingView: React.FC<BrowsingViewProps> = ({ query, result, isLoading, error, onComplete, onNewSearch }) => {
  const sources = result?.sources || [];
  const [completedTabs, setCompletedTabs] = useState<boolean[]>(new Array(sources.length).fill(false));
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Start animation as soon as result is available.
    if (result) {
      if (sources.length === 0) {
        // If no sources, just show done and proceed
        const doneTimeout = setTimeout(() => setIsDone(true), 500);
        const completeTimeout = setTimeout(() => onComplete(), 1500);
        return () => {
          clearTimeout(doneTimeout);
          clearTimeout(completeTimeout);
        };
      }

      const timeouts: ReturnType<typeof setTimeout>[] = [];
      sources.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setCompletedTabs(prev => {
            const newCompleted = [...prev];
            newCompleted[index] = true;
            return newCompleted;
          });
        }, (index + 1) * 700); // Stagger animation
        timeouts.push(timeout);
      });

      const doneTimeout = setTimeout(() => {
        setIsDone(true);
      }, sources.length * 700 + 500);
      timeouts.push(doneTimeout);

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, sources.length * 700 + 1500);
      timeouts.push(completeTimeout);

      return () => {
        timeouts.forEach(clearTimeout);
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
                <h2 className="text-3xl font-bold text-gray-800">Done!</h2>
                <p className="text-gray-600">Proceeding to image generation...</p>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                <div className="ml-4 flex-grow bg-gray-200/80 rounded-full h-8 flex items-center px-4">
                    <p className="text-sm text-gray-600 truncate">{query || 'Searching...'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-50/70 overflow-x-auto p-2 border-b border-gray-200">
                {sources.length > 0 ? (
                    sources.map((source, index) => (
                        <div key={index} className={`flex items-center gap-2 flex-shrink-0 max-w-[200px] px-3 py-2 transition-all duration-300 rounded-full shadow-sm ${completedTabs[index] ? 'bg-white text-gray-800 font-medium' : 'bg-gray-200/50 text-gray-500'}`}>
                            {completedTabs[index] ? (
                                <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                                <ClockIcon className="w-4 h-4 animate-spin flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{source.title || 'Researching...'}</span>
                        </div>
                    ))
                ) : (
                     <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        <span className="text-sm">Identifying sources...</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col justify-center items-center p-8 text-center bg-white">
                <div className="flex items-center gap-3 text-gray-500">
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                     <p className="font-medium">Silo agent is browsing for you...</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">This may take a while depending on the prompt.</p>
            </div>
        </>
    );
  };

  return (
    <div className="flex-grow flex justify-center items-center p-4 sm:p-6 lg:p-8 bg-white">
       <div className="w-full max-w-4xl h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden">
        {renderContent()}
       </div>
    </div>
  );
};

export default BrowsingView;