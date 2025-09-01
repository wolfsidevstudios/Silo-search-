
import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from './icons';

interface MusicPlayerWidgetProps {
  isVisible: boolean;
  onClose: () => void;
}

const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({ isVisible, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const widgetStartPos = useRef({ x: 0, y: 0 });
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isVisible && !isInitialized.current && widgetRef.current) {
      const widgetWidth = 320; 
      // Approximate height of the Elfsight widget + custom header
      const widgetHeight = (widgetRef.current.offsetHeight > 0) ? widgetRef.current.offsetHeight : 112; 
      
      setPosition({
        x: window.innerWidth - widgetWidth - 24,
        y: window.innerHeight - widgetHeight - 24
      });
      isInitialized.current = true;
    }
  }, [isVisible]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widgetRef.current) {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      const rect = widgetRef.current.getBoundingClientRect();
      widgetStartPos.current = { x: rect.left, y: rect.top };
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        setPosition({
          x: widgetStartPos.current.x + dx,
          y: widgetStartPos.current.y + dy,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  useEffect(() => {
    if (isVisible && (window as any).ElfsightApps) {
        (window as any).ElfsightApps.init();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={widgetRef}
      className="fixed z-50 w-[320px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden select-none animate-in fade-in duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        opacity: isInitialized.current ? 1 : 0,
        transition: isInitialized.current ? 'opacity 0.3s' : 'none',
      }}
    >
      <div
        className="h-8 bg-gray-100 flex items-center justify-between px-2"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-semibold text-gray-600">Music Player</span>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-800"
          aria-label="Close music player"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="elfsight-app-4a320804-d292-4885-9f34-74775718d953" data-elfsight-app-lazy></div>
    </div>
  );
};

export default MusicPlayerWidget;
