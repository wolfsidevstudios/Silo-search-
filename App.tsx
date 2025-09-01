
import React, { useState, useCallback, useEffect } from 'react';
import HomeSearch from './components/HomeSearch';
import BrowsingView from './components/BrowsingView';
import DeepResearchView from './components/DeepResearchView';
import ResultsView from './components/ResultsView';
import ImageAnalysisView from './components/ImageAnalysisView';
import ImageResultsView from './components/ImageResultsView';
import DocsView from './components/DocsView';
import CreativeView from './components/CreativeView';
import ChatView from './components/ChatView';
import { StopIcon } from './components/icons';
import { runWebSearch, runImageAnalysis, determineModelForQuery, runCreativeTask, ai } from './services/geminiService';
import type { WebSearchResult, ImageSearchResult, AgentType, ChatMessage, CustomizationSettings } from './types';
import { Chat } from "@google/genai";

type View = 'home' | 'docs' | 'browsing' | 'deep_research' | 'results' | 'image_analysis' | 'image_results' | 'creative' | 'chat';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState<string>('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [agentType, setAgentType] = useState<AgentType>('auto');
  
  const [webSearchResult, setWebSearchResult] = useState<WebSearchResult | null>(null);
  const [imageSearchResult, setImageSearchResult] = useState<ImageSearchResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [customizationSettings, setCustomizationSettings] = useState<CustomizationSettings>(() => {
    try {
        const savedSettings = localStorage.getItem('customizationSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            backgroundUrl: 'https://i.ibb.co/Y43V0QcT/IMG-3726.png',
            inputSize: 'large',
            inputShape: 'rounded',
            inputTheme: 'white',
            language: 'en',
        };
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return {
            backgroundUrl: 'https://i.ibb.co/Y43V0QcT/IMG-3726.png',
            inputSize: 'large',
            inputShape: 'rounded',
            inputTheme: 'white',
            language: 'en',
        };
    }
  });

  useEffect(() => {
      try {
          localStorage.setItem('customizationSettings', JSON.stringify(customizationSettings));
      } catch (error) {
          console.error("Failed to save settings to localStorage", error);
      }
  }, [customizationSettings]);
  
  const handleSettingsChange = (newSettings: Partial<CustomizationSettings>) => {
      setCustomizationSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleSearch = useCallback(async (currentQuery: string, currentImageDataUrl: string | null, currentAgent: AgentType) => {
    if (!currentQuery.trim() && !currentImageDataUrl) return;
    
    setQuery(currentQuery);
    setAgentType(currentAgent);
    setIsLoading(true);
    setError(null);
    setWebSearchResult(null);
    setImageSearchResult(null);
    setChatHistory([]);
    setChatSession(null);
    
    try {
      let model: string;
      if (currentAgent === 'auto') {
        if (currentImageDataUrl && !currentQuery.trim()) {
            model = 'gemini-2.5-pro'; // Default to pro for image-only analysis
        } else {
            model = await determineModelForQuery(currentQuery);
        }
      } else {
        // For 'deep_research' and 'creative', use the pro model.
        model = 'gemini-2.5-pro';
      }

      if (currentImageDataUrl) {
        setView('image_analysis');
        const result = await runImageAnalysis(currentQuery, currentImageDataUrl, model);
        setImageSearchResult(result);
        setIsLoading(false);
      } else if (currentAgent === 'creative') {
        setView('creative');
        const result = await runCreativeTask(currentQuery, model);
        setWebSearchResult(result);
        setIsLoading(false);
      } else {
        setView(currentAgent === 'deep_research' ? 'deep_research' : 'deep_research');
        const result = await runWebSearch(currentQuery, model);
        setWebSearchResult(result);
        // Loading continues for the browsing animation
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please try again.');
      setIsLoading(false);
      if (view !== 'browsing' && view !== 'image_analysis' && view !== 'deep_research' && view !== 'creative') {
        setView('home');
      }
    }
  }, [view]);

  const handleNewSearch = () => {
    setWebSearchResult(null);
    setImageSearchResult(null);
    setQuery('');
    setImageDataUrl(null);
    setError(null);
    setChatHistory([]);
    setChatSession(null);
    setView('home');
  }
  
  const handleStop = () => {
    setIsLoading(false);
    // Add any cancellation logic for ongoing requests if the API supports it
    handleNewSearch();
  }

  const handleStartChat = () => {
    if (!webSearchResult) return;
    
    const model = (agentType === 'creative') ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
    
    const initialHistory = [
      { role: "user", parts: [{ text: query }] },
      { role: "model", parts: [{ text: webSearchResult.text }] }
    ];

    const newChat = ai.chats.create({
      model: model,
      history: initialHistory
    });

    setChatSession(newChat);
    setChatHistory([
      { role: 'user', content: query },
      { role: 'model', content: webSearchResult.text }
    ]);
    setView('chat');
  };

  const handleSendChatMessage = async (message: string) => {
    if (!chatSession || !message.trim()) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message });
      setChatHistory([...newHistory, { role: 'model', content: response.text }]);
    } catch (err) {
      console.error(err);
      setChatHistory([...newHistory, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegenerate = () => {
    if (query || imageDataUrl) {
      handleSearch(query, imageDataUrl, agentType);
    }
  }

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <HomeSearch
            onSearch={(q, img, agent) => {
              setImageDataUrl(img);
              handleSearch(q, img, agent);
            }}
            isLoading={isLoading}
            settings={customizationSettings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'docs':
        return <DocsView onClose={() => setView('home')} />;
      case 'browsing':
        return (
          <BrowsingView 
            query={query}
            result={webSearchResult}
            isLoading={isLoading}
            error={error}
            onComplete={() => {
                setIsLoading(false);
                setView('results');
            }}
            onNewSearch={handleNewSearch}
          />
        );
        case 'deep_research':
            return (
              <DeepResearchView
                query={query}
                result={webSearchResult}
                error={error}
                onComplete={() => {
                    setIsLoading(false);
                    setView('results');
                }}
                onNewSearch={handleNewSearch}
              />
            );
      case 'creative':
        return (
            <CreativeView 
                result={webSearchResult}
                error={error}
                onComplete={() => setView('results')}
                onNewSearch={handleNewSearch}
            />
        );
      case 'results':
        return (
          <ResultsView
            query={query}
            onSearch={(q, newAgent) => handleSearch(q, null, newAgent || agentType)}
            result={webSearchResult}
            isLoading={isLoading}
            error={error}
            onNewSearch={handleNewSearch}
            onStartChat={handleStartChat}
            agentType={agentType}
            isChatAvailable={agentType !== 'creative'}
          />
        );
      case 'image_analysis':
        return (
            <ImageAnalysisView
                imageDataUrl={imageDataUrl}
                result={imageSearchResult}
                error={error}
                onComplete={() => setView('image_results')}
                onNewSearch={handleNewSearch}
            />
        );
      case 'image_results':
        return (
            <ImageResultsView
                result={imageSearchResult}
                onNewSearch={handleNewSearch}
                onRegenerate={handleRegenerate}
            />
        );
       case 'chat':
        return (
            <ChatView
                history={chatHistory}
                onSendMessage={handleSendChatMessage}
                isLoading={isLoading}
                onNewSearch={handleNewSearch}
            />
        );
      default:
        return null;
    }
  }

  return (
    <main className="bg-white min-h-screen font-sans text-gray-800 flex flex-col relative">
       {view === 'home' && (
        <div className="absolute top-0 left-0 p-4 sm:p-6 lg:p-8 z-20 flex items-center gap-4">
            <button onClick={() => setView('docs')} className="text-white font-semibold hover:text-gray-300 transition-colors text-lg">Docs</button>
        </div>
      )}
      {renderContent()}

      {isLoading && ['browsing', 'deep_research', 'image_analysis', 'creative'].includes(view) && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={handleStop}
            className="flex items-center gap-2 bg-black text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors animate-in fade-in duration-300"
          >
            <StopIcon className="w-5 h-5" />
            Stop
          </button>
        </div>
      )}
    </main>
  );
};

export default App;
