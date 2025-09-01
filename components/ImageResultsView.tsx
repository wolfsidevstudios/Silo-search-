
import React, { useState } from 'react';
import type { ImageSearchResult } from '../types';
import { BackArrowIcon, CopyIcon, RefreshIcon } from './icons';

interface ImageResultsViewProps {
    result: ImageSearchResult | null;
    onNewSearch: () => void;
    onRegenerate: () => void;
}

const ImageResultsView: React.FC<ImageResultsViewProps> = ({ result, onNewSearch, onRegenerate }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleCopy = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text).then(() => {
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 2000);
            });
        }
    };
    
    return (
         <div className="flex flex-col flex-grow w-full">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
                <button 
                    onClick={onNewSearch} 
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                    title="Start a new search"
                >
                    <BackArrowIcon className="w-5 h-5"/>
                </button>
                <h2 className="font-semibold text-gray-700">Image Analysis Result</h2>
                </div>
            </header>
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4 sm:p-6 lg:p-8">
               {result ? (
                <div className="max-w-2xl animate-in fade-in duration-500">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {result.text}
                    </p>
                    <div className="flex justify-center items-center gap-4 mt-8">
                         <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                            <CopyIcon className="w-5 h-5"/>
                            {copyStatus === 'copied' ? 'Copied!' : 'Copy Text'}
                        </button>
                        <button
                            onClick={onRegenerate}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                            <RefreshIcon className="w-5 h-5"/>
                            Re-generate
                        </button>
                    </div>
                </div>
               ) : (
                <div className="text-gray-500">Loading result...</div>
               )}
            </div>
        </div>
    );
};

export default ImageResultsView;
