
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { LinkIcon, BackArrowIcon, CopyIcon, CheckIcon, DocumentTextIcon, PhotoIcon, ListBulletIcon, WandIcon } from './icons';
import type { WebSearchResult, AgentType } from '../types';

interface ResultsViewProps {
  query: string;
  onSearch: (query: string, agent?: AgentType) => void;
  result: WebSearchResult | null;
  isLoading: boolean;
  error: string | null;
  onNewSearch: () => void;
  onStartChat: () => void;
  isChatAvailable: boolean;
  agentType: AgentType;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-1/2 mt-8"></div>
         <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        </div>
    </div>
);

const CodeBlock: React.FC<{ language: string; children: string }> = ({ language, children }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        });
    };

    return (
        <div className="bg-gray-900 text-white rounded-lg my-6 not-prose">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-lg">
                <span className="text-sm font-semibold text-gray-400">{language || 'code'}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    {copyStatus === 'copied' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
                <code className={`language-${language}`}>{children}</code>
            </pre>
        </div>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ query, onSearch, result, isLoading, error, onNewSearch, onStartChat, isChatAvailable, agentType }) => {
  const [activeTab, setActiveTab] = useState<'result' | 'images' | 'steps'>('result');

  const formatText = (text: string) => {
    const lines = text.split('\n');
    const elements = [];
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockContent: string[] = [];

    const parseInlineFormatting = (line: string) => {
      const escapeHtml = (unsafe: string) =>
        unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
      return escapeHtml(line)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside my-4 pl-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: parseInlineFormatting(item) }}></li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          elements.push(
            <CodeBlock key={`code-${elements.length}`} language={codeBlockLang}>
              {codeBlockContent.join('\n')}
            </CodeBlock>
          );
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
          inCodeBlock = true;
          codeBlockLang = line.trim().substring(3);
        }
      } else if (inCodeBlock) {
        codeBlockContent.push(line);
      } else {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
          listItems.push(trimmedLine.substring(2));
        } else {
          flushList();
          if (trimmedLine.startsWith('### ')) {
            elements.push(<h3 key={index} className="text-xl font-semibold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(4)) }}></h3>);
          } else if (trimmedLine.startsWith('## ')) {
            elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b pb-2" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(3)) }}></h2>);
          } else if (trimmedLine.startsWith('# ')) {
            elements.push(<h1 key={index} className="text-3xl font-bold mt-8 mb-4 border-b pb-2" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(2)) }}></h1>);
          } else if (trimmedLine) {
            elements.push(<p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine) }}></p>);
          }
        }
      }
    });

    flushList();
    if (inCodeBlock) { // Close any unclosed code block at the end
        elements.push(
            <CodeBlock key={`code-${elements.length}`} language={codeBlockLang}>
              {codeBlockContent.join('\n')}
            </CodeBlock>
          );
    }
    return elements;
  };

  const renderContent = () => {
    if (isLoading && !result) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }
    if (!result) {
      return null;
    }

    switch (activeTab) {
      case 'result':
        return (
          <div className="prose max-w-none text-lg text-gray-700 animate-in fade-in duration-300">
            {formatText(result.text)}
          </div>
        );
      case 'images':
        return (
          <div className="animate-in fade-in duration-300">
            {result.images && result.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {result.images.map((imgSrc, index) => (
                  <a href={imgSrc} target="_blank" rel="noopener noreferrer" key={index} className="block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={imgSrc}
                      alt={`AI generated image ${index + 1}`}
                      className="w-full h-full object-cover aspect-[16/9]"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold">No Images Generated</h3>
                <p>Images were not generated for this query.</p>
              </div>
            )}
          </div>
        );
      case 'steps':
        const aiSteps = [
          "Deconstructed user query to understand intent.",
          "Identified key concepts and entities.",
          "Formulated search queries for grounding.",
          "Searched web for relevant and authoritative information.",
          "Synthesized findings from multiple sources.",
          "Structured the answer for clarity and readability.",
          "Formatted the final response in Markdown.",
        ];
        return (
          <div className="animate-in fade-in duration-300">
            <div className="prose max-w-none text-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Steps</h2>
                <ul className="space-y-3">
                    {aiSteps.map((step, index) => (
                        <li key={index} className="flex items-center">
                            <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>

                {result.sources && result.sources.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-t pt-6">Sources</h2>
                    <ul className="space-y-3">
                      {result.sources.map((source, index) => (
                        <li key={index} className="flex items-start">
                           <LinkIcon className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                           <div>
                            <a
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-words"
                            >
                                {source.title}
                            </a>
                            <p className="text-sm text-gray-500 break-all">{source.uri}</p>
                           </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{
    tabName: 'result' | 'images' | 'steps';
    label: string;
    icon: React.ReactNode;
    count?: number;
  }> = ({ tabName, label, icon, count }) => {
    const isActive = activeTab === tabName;
    const hasContent = !(tabName === 'images' && (!result?.images || result.images.length === 0));
    
    return (
      <button
        onClick={() => {
          if (hasContent) setActiveTab(tabName)
        }}
        disabled={!hasContent}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
          isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${!hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon}
        {label}
        {typeof count !== 'undefined' && hasContent && (
            <span className={`ml-1 text-xs rounded-full px-2 py-0.5 ${isActive ? 'bg-white text-indigo-600' : 'bg-gray-200 text-gray-700'}`}>
                {count}
            </span>
        )}
      </button>
    );
  };
    
  return (
    <div className="flex flex-col flex-grow bg-gray-50/50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <button 
            onClick={onNewSearch} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            title="Start a new search"
          >
            <BackArrowIcon className="w-5 h-5"/>
          </button>
          <SearchBar 
            initialQuery={query} 
            onSearch={(q) => onSearch(q)} 
            isLoading={isLoading} 
            onStartChat={onStartChat}
            isChatAvailable={!!result && isChatAvailable}
          />
        </div>
        
        {result && (
          <div className="border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
                <TabButton tabName="result" label="Result" icon={<DocumentTextIcon className="w-5 h-5"/>} />
                <TabButton tabName="images" label="Images" icon={<PhotoIcon className="w-5 h-5"/>} count={result.images?.length || 0} />
                <TabButton tabName="steps" label="Steps & Sources" icon={<ListBulletIcon className="w-5 h-5"/>} count={result.sources?.length || 0} />
            </div>
          </div>
        )}
      </header>

      <div className="flex-grow w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultsView;