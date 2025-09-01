import React, { useState, useEffect } from 'react';
import { CheckIcon, SparklesIcon } from './icons';

interface GeneratingImagesViewProps {
  imagesGenerated: boolean;
  onComplete: () => void;
}

const GeneratingImagesView: React.FC<GeneratingImagesViewProps> = ({ imagesGenerated, onComplete }) => {
  const [completedImages, setCompletedImages] = useState([false, false, false]);
  const [statusText, setStatusText] = useState('Generating images...');

  useEffect(() => {
    if (imagesGenerated) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      // Animate checkmarks
      timeouts.push(setTimeout(() => setCompletedImages([true, false, false]), 300));
      timeouts.push(setTimeout(() => setCompletedImages([true, true, false]), 600));
      timeouts.push(setTimeout(() => setCompletedImages([true, true, true]), 900));

      // Update text and navigate
      timeouts.push(setTimeout(() => setStatusText('Generated images!'), 1200));
      timeouts.push(setTimeout(() => onComplete(), 2200));

      return () => timeouts.forEach(clearTimeout);
    }
  }, [imagesGenerated, onComplete]);

  return (
    <div className="flex-grow flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-white">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2">
            <SparklesIcon className="w-7 h-7 text-indigo-500" />
            <h1 className="text-2xl font-bold text-gray-800">Silo Gen AI</h1>
        </div>
        <p className="text-gray-500 mt-2">{statusText}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative w-64 h-36 sm:w-56 sm:h-32 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
            <div className="w-full h-full bg-gray-300 backdrop-blur-xl blur-xl"></div>
            {completedImages[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            {!imagesGenerated && !completedImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratingImagesView;