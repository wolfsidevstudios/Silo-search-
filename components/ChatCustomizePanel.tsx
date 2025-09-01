
import React from 'react';
import { XIcon } from './icons';
import { PREMADE_BACKGROUNDS } from './CustomizePanel';
import type { CustomizationSettings } from '../types';

interface ChatCustomizePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (newSettings: Partial<CustomizationSettings>) => void;
  currentBackground: string | undefined;
}

const ChatCustomizePanel: React.FC<ChatCustomizePanelProps> = ({ isOpen, onClose, onSettingsChange, currentBackground }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-chat-panel-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <h2 id="customize-chat-panel-title" className="text-xl font-bold text-gray-800">Chat Background</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:bg-gray-800 transition-colors" aria-label="Close customization panel">
                <XIcon className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-grow p-6 overflow-y-auto space-y-8">
                <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Premade</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {PREMADE_BACKGROUNDS.map(url => (
                    <button
                        key={url}
                        onClick={() => onSettingsChange({ chatBackgroundUrl: url })}
                        className={`relative aspect-video rounded-md overflow-hidden focus:outline-none ring-offset-2 ring-indigo-500 ${currentBackground === url ? 'ring-2' : 'focus:ring-2'}`}
                    >
                        <img src={url} alt={`Background option`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors"></div>
                    </button>
                    ))}
                </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div>
                    <button
                        onClick={() => onSettingsChange({ chatBackgroundUrl: undefined })}
                        className="w-full text-center bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Remove Background
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCustomizePanel;
