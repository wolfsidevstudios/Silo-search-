
import React, { useState, useRef, useEffect } from 'react';
import { UpArrowIcon, SparklesIcon, PlusIcon, XIcon, LightningIcon, DiamondIcon, CheckIcon, BrainIcon, WandIcon, BookOpenIcon, ChatBubbleIcon } from './icons';
import type { AgentType } from '../types';

interface HomeSearchProps {
  onSearch: (query: string, imageDataUrl: string | null, agent: AgentType) => void;
  isLoading: boolean;
}

const AgentSelectorPopup: React.FC<{ 
  onClose: () => void,
  selectedAgent: AgentType,
  onSelect: (agent: AgentType) => void
}> = ({ onClose, selectedAgent, onSelect }) => {
  
  const handleSelect = (agent: AgentType) => {
    onSelect(agent);
    onClose();
  }

  const AgentButton: React.FC<{
    agentType: AgentType;
    title: string;
    icon: React.ReactNode;
  }> = ({ agentType, title, icon }) => {
    const isSelected = selectedAgent === agentType;
    return (
      <button 
        onClick={() => handleSelect(agentType)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${isSelected ? 'bg-indigo-50 border-indigo-400' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
            {icon}
        </div>
        <span className={`font-semibold ${isSelected ? 'text-indigo-800' : 'text-gray-700'}`}>{title}</span>
        {isSelected && (
            <CheckIcon className="w-5 h-5 ml-auto text-indigo-600"/>
        )}
      </button>
    )
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative animate-in fade-in zoom-in-95 duration-300 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-gray-800">Select Agent</h3>
          <p className="text-gray-500 text-sm mt-1">Choose an agent for your task.</p>
        </div>
        <div className="space-y-2">
           <AgentButton 
            agentType="auto"
            title="S1 Mini"
            icon={<ChatBubbleIcon className="w-5 h-5"/>}
          />
           <AgentButton 
            agentType="deep_research"
            title="Deep Research"
            icon={<BrainIcon className="w-5 h-5"/>}
          />
           <AgentButton 
            agentType="creative"
            title="Creative Agent"
            icon={<WandIcon className="w-5 h-5"/>}
          />
        </div>
      </div>
    </div>
  );
};


const HomeSearch: React.FC<HomeSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [agent, setAgent] = useState<AgentType>('auto');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch(query, imageDataUrl, agent);
      setQuery('');
      setImageDataUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
        e.target.value = '';
    }
  };
  
  const handleRemoveImage = () => {
    setImageDataUrl(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const getAgentButtonText = () => {
    switch (agent) {
        case 'auto': return 'S1 Mini';
        case 'deep_research': return 'Deep Research';
        case 'creative': return 'Creative Agent';
        default: return 'Agent';
    }
  }

  return (
    <>
    {showAgentSelector && <AgentSelectorPopup 
      onClose={() => setShowAgentSelector(false)}
      selectedAgent={agent}
      onSelect={setAgent}
    />}
    <div 
      className="flex-grow flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 w-full bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.ibb.co/Y43V0QcT/IMG-3726.png')" }}
    >
        <div className="absolute top-0 right-0 p-4 sm:p-6 lg:p-8 z-10">
            <p className="text-white text-lg font-semibold">{currentTime}</p>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <div className="text-center relative z-10">
                <p className="text-lg text-gray-200 max-w-md mx-auto">
                  The world's first agent-powered AI search browser. Go beyond links and get answers.
                </p>
            </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex flex-col gap-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent"
            >
              <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Let's search..."
                  className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 text-lg resize-none"
                  rows={3}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
              />
              <div className="flex items-center mt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {!imageDataUrl && (
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Add image">
                        <PlusIcon className="w-6 h-6" />
                     </button>
                  )}
                 
                  <div className="w-px h-6 bg-gray-200"></div>

                  {imageDataUrl && (
                    <div className="relative animate-in fade-in duration-300">
                      <img src={imageDataUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <button 
                        type="button" 
                        onClick={handleRemoveImage} 
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black"
                        aria-label="Remove image"
                      >
                        <XIcon className="w-3 h-3"/>
                      </button>
                    </div>
                  )}

                  <button type="button" onClick={() => setShowAgentSelector(true)} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    {getAgentButtonText()}
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="ml-auto w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-400 transition-colors duration-200"
                  disabled={isLoading || (!query.trim() && !imageDataUrl)}
                  aria-label="Submit search"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <UpArrowIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </form>
        </div>
    </div>
    </>
  );
};

export default HomeSearch;
