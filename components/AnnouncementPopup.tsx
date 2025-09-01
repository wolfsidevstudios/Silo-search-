
import React from 'react';
import { XIcon, SparklesIcon, ChatBubbleIcon } from './icons';

const AnnouncementPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative zoom-in-95 duration-300 p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">The Next Evolution is Coming</h2>
                <p className="text-gray-600 mt-2">Get ready for a smarter, faster, and more personal AI experience.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Agent 3.0</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                        <li><span className="font-semibold">Proactive Assistance:</span> Anticipates your needs and suggests next steps.</li>
                        <li><span className="font-semibold">Personalized Workflows:</span> Creates and saves multi-step routines for your common tasks.</li>
                        <li><span className="font-semibold">Live Data Integration:</span> Connects to real-time data for the most current answers.</li>
                    </ul>
                </div>
                
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                            <ChatBubbleIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">S2 Mini</h3>
                    </div>
                     <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                        <li><span className="font-semibold">Lightning-Fast Responses:</span> A new, optimized model for near-instant chat.</li>
                        <li><span className="font-semibold">Voice Command Integration:</span> Talk directly to S2 Mini to get things done faster.</li>
                        <li><span className="font-semibold">Enhanced Contextual Memory:</span> Remembers previous conversations for a seamless experience.</li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-105"
                >
                    Sounds exciting!
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
