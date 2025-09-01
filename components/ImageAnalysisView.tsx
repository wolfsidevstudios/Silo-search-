import React, { useState, useEffect } from 'react';
import type { ImageSearchResult } from '../types';

interface ImageAnalysisViewProps {
  imageDataUrl: string | null;
  result: ImageSearchResult | null;
  error: string | null;
  onComplete: () => void;
  onNewSearch: () => void;
}

const BUBBLE_POSITIONS = [
    'top-1/4 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-0 right-1/4 translate-x-1/2 -translate-y-1/2',
    'top-3/4 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2',
    'top-1/2 left-full -translate-y-1/2',
];

const LoadingBubble: React.FC<{position: string}> = ({ position }) => (
    <div className={`absolute ${position} w-24 h-12 bg-gray-200 rounded-full animate-pulse`}></div>
);

const KeywordBubble: React.FC<{ keyword: string, position: string, delay: number }> = ({ keyword, position, delay }) => (
    <div
        className={`absolute ${position} bg-white shadow-lg rounded-full px-4 py-2 text-gray-700 font-medium whitespace-nowrap animate-in fade-in zoom-in-95`}
        style={{ animationDuration: '300ms', animationDelay: `${delay}ms` }}
    >
        {keyword}
    </div>
);


const ImageAnalysisView: React.FC<ImageAnalysisViewProps> = ({ imageDataUrl, result, error, onComplete, onNewSearch }) => {
    const [visibleBubbles, setVisibleBubbles] = useState(0);
    const keywords = result?.keywords || [];

    useEffect(() => {
        if (keywords.length > 0) {
            const timeouts: ReturnType<typeof setTimeout>[] = [];
            keywords.forEach((_, index) => {
                const timeout = setTimeout(() => {
                    setVisibleBubbles(prev => prev + 1);
                }, (index + 1) * 400);
                timeouts.push(timeout);
            });

            const completeTimeout = setTimeout(() => {
                onComplete();
            }, (keywords.length * 400) + 1000);
            timeouts.push(completeTimeout);

            return () => {
                timeouts.forEach(clearTimeout);
            };
        } else if (result === null && !error) {
             // Initial loading state before result arrives
            const interval = setInterval(() => {
                setVisibleBubbles(prev => (prev + 1) % (BUBBLE_POSITIONS.length + 1));
            }, 300);
            return () => clearInterval(interval);
        }
    }, [keywords, result, onComplete, error]);


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
        <div className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-white w-full">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Silo Image Search</h1>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">Beta</span>
            </div>

            <div className="relative w-[28rem] h-[28rem]">
                {imageDataUrl ? (
                    <img
                        src={imageDataUrl}
                        alt="User upload"
                        className="w-full h-full object-contain rounded-3xl"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 rounded-3xl animate-pulse"></div>
                )}

                {/* Animation Bubbles */}
                {result ? (
                     keywords.slice(0, visibleBubbles).map((keyword, index) => (
                        <KeywordBubble key={index} keyword={keyword} position={BUBBLE_POSITIONS[index % BUBBLE_POSITIONS.length]} delay={0} />
                    ))
                ) : (
                    // Loading state bubbles
                    Array.from({ length: 5 }).map((_, index) => (
                       visibleBubbles === index && <LoadingBubble key={index} position={BUBBLE_POSITIONS[index]} />
                    ))
                )}
            </div>

            <p className="text-gray-500 mt-8 animate-pulse">Analyzing image...</p>
        </div>
    );
};

export default ImageAnalysisView;