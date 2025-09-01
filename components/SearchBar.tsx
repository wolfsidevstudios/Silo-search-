
import React, { useState } from 'react';
import { UpArrowIcon } from './icons';

interface SearchBarProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  isLoading: boolean;
  onStartChat: () => void;
  isChatAvailable: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery, onSearch, isLoading, onStartChat, isChatAvailable }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask another question..."
          className="w-full pl-5 pr-14 py-3 text-base bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isChatAvailable && (
                <button
                    type="button"
                    onClick={onStartChat}
                    className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Chat
                </button>
            )}
            <button
              type="submit"
              className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-400 transition-colors duration-200 flex-shrink-0"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <UpArrowIcon className="w-5 h-5" />
              )}
            </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
