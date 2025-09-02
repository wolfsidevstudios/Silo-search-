
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { UpArrowIcon, SparklesIcon } from './icons';
import { CopyIcon, CheckIcon } from './icons'; // Re-using from ResultsView

const CodeBlock: React.FC<{ language: string; children: string }> = ({ language, children }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        });
    };

    return (
        <div className="bg-gray-800 text-white rounded-lg my-4 max-w-full">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50 rounded-t-lg">
                <span className="text-sm font-semibold text-gray-300">{language || 'code'}</span>
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
          <ul key={`ul-${elements.length}`} className="list-disc list-inside my-2 pl-4 space-y-1">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: parseInlineFormatting(item) }}></li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line) => {
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
            elements.push(<h3 key={elements.length} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(4)) }}></h3>);
          } else if (trimmedLine.startsWith('## ')) {
            elements.push(<h2 key={elements.length} className="text-xl font-bold mt-5 mb-3" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(3)) }}></h2>);
          } else if (trimmedLine.startsWith('# ')) {
            elements.push(<h1 key={elements.length} className="text-2xl font-bold mt-6 mb-4" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine.substring(2)) }}></h1>);
          } else if (trimmedLine) {
            elements.push(<p key={elements.length} className="mb-2" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(trimmedLine) }}></p>);
          }
        }
      }
    });

    flushList();
    if (inCodeBlock) {
        elements.push(
            <CodeBlock key={`code-${elements.length}`} language={codeBlockLang}>
              {codeBlockContent.join('\n')}
            </CodeBlock>
        );
    }
    return elements;
};

interface ChatViewProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ history, onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex-grow overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 pt-24 pb-32 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {history.map((chat, index) => (
                <div key={index} className={`flex gap-4 ${chat.role === 'user' ? 'justify-end' : ''}`}>
                  {chat.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <SparklesIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`text-base max-w-xl ${
                    chat.role === 'user' 
                      ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-br-none p-4' 
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 border border-gray-200'
                  }`}>
                    {formatText(chat.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <SparklesIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 p-4 rounded-2xl rounded-bl-none bg-white border border-gray-200">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      <span>Thinking...</span>
                    </div>
                 </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto p-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a follow-up..."
                  className="w-full pl-5 pr-14 py-3 text-base bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-lg"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-400 transition-colors duration-200"
                  disabled={isLoading || !message.trim()}
                  aria-label="Send message"
                >
                  <UpArrowIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </footer>
      </div>
  );
};

export default ChatView;
