
import React, { useState, useRef, useEffect } from 'react';
import { UpArrowIcon, SparklesIcon, PlusIcon, XIcon, LightningIcon, DiamondIcon, CheckIcon, BrainIcon, WandIcon, BookOpenIcon, ChatBubbleIcon, SettingsIcon, MicrophoneIcon, SiloLiveIcon } from './icons';
import type { AgentType, CustomizationSettings } from '../types';
import CustomizePanel from './CustomizePanel';

interface HomeSearchProps {
  onSearch: (query: string, imageDataUrl: string | null, agent: AgentType) => void;
  isLoading: boolean;
  settings: CustomizationSettings;
  onSettingsChange: (newSettings: Partial<CustomizationSettings>) => void;
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
           <AgentButton 
            agentType="live"
            title="Silo Live"
            icon={<MicrophoneIcon className="w-5 h-5"/>}
          />
        </div>
      </div>
    </div>
  );
};


const HomeSearch: React.FC<HomeSearchProps> = ({ onSearch, isLoading, settings, onSettingsChange }) => {
  const [query, setQuery] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [agent, setAgent] = useState<AgentType>('auto');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isCustomizePanelOpen, setIsCustomizePanelOpen] = useState(false);
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
      if (agent !== 'live') {
          setQuery('');
          setImageDataUrl(null);
      }
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
  
  const handleSelectAgent = (selectedAgent: AgentType) => {
    setAgent(selectedAgent);
    if (selectedAgent === 'live') {
        onSearch('', null, 'live');
    }
  }

  const getAgentButtonText = () => {
    switch (agent) {
        case 'auto': return 'S1 Mini';
        case 'deep_research': return 'Deep Research';
        case 'creative': return 'Creative Agent';
        case 'live': return 'Silo Live';
        default: return 'Agent';
    }
  }
  
  const themeStyles = {
    white: {
        form: 'bg-white border-gray-200',
        text: 'text-gray-900 placeholder-gray-500',
        icon: 'text-gray-500 hover:text-gray-800',
        divider: 'bg-gray-200',
        agentButton: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    transparent: {
        form: 'bg-white/10 backdrop-blur-md border-white/20',
        text: 'text-white placeholder-gray-200',
        icon: 'text-gray-200 hover:text-white',
        divider: 'bg-white/20',
        agentButton: 'bg-white/10 text-white hover:bg-white/20',
    },
    black: {
        form: 'bg-black border-gray-700',
        text: 'text-white placeholder-gray-400',
        icon: 'text-gray-400 hover:text-white',
        divider: 'bg-gray-700',
        agentButton: 'bg-gray-800 text-gray-200 hover:bg-gray-700',
    },
    lightGrey: {
        form: 'bg-gray-100 border-gray-300',
        text: 'text-gray-800 placeholder-gray-500',
        icon: 'text-gray-500 hover:text-gray-800',
        divider: 'bg-gray-300',
        agentButton: 'bg-white text-gray-700 hover:bg-gray-200',
    }
  };
  
  const currentTheme = themeStyles[settings.inputTheme];
  
  const formClasses = [
      'border',
      'shadow-lg',
      'p-4',
      'flex',
      'flex-col',
      'gap-2',
      'transition-all',
      'focus-within:ring-2',
      'focus-within:ring-indigo-500',
      'focus-within:border-transparent',
      settings.inputShape === 'rounded' ? 'rounded-2xl' : 'rounded-full',
      currentTheme.form
    ].join(' ');
    
  const textareaRows = settings.inputSize === 'large' ? 3 : 1;


  return (
    <>
    {showAgentSelector && <AgentSelectorPopup 
      onClose={() => setShowAgentSelector(false)}
      selectedAgent={agent}
      onSelect={handleSelectAgent}
    />}
     <CustomizePanel
        isOpen={isCustomizePanelOpen}
        onClose={() => setIsCustomizePanelOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
    />
    <div 
      className="flex-grow flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${settings.backgroundUrl}')` }}
    >
        <div className="absolute top-0 right-0 p-4 sm:p-6 lg:p-8 z-10 flex items-center gap-4">
            <p className="text-white text-lg font-semibold">{currentTime}</p>
            <button 
                onClick={() => setIsCustomizePanelOpen(true)}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Customize page"
            >
                <SettingsIcon className="w-6 h-6"/>
            </button>
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
              className={formClasses}
            >
              <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Let's search..."
                  className={`w-full bg-transparent focus:outline-none text-lg resize-none ${currentTheme.text}`}
                  rows={textareaRows}
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
                     <button type="button" onClick={() => fileInputRef.current?.click()} className={`transition-colors ${currentTheme.icon}`} aria-label="Add image">
                        <PlusIcon className="w-6 h-6" />
                     </button>
                  )}

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

                   <button
                        type="button"
                        onClick={() => handleSelectAgent('live')}
                        className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors flex-shrink-0"
                        aria-label="Start Silo Live"
                    >
                        <SiloLiveIcon className="w-6 h-6" />
                    </button>
                 
                  <div className={`w-px h-6 ${currentTheme.divider}`}></div>

                  <button type="button" onClick={() => setShowAgentSelector(true)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentTheme.agentButton}`}>
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
