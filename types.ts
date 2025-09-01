
export interface Source {
  uri: string;
  title: string;
  description?: string;
}

export interface WebSearchResult {
  type: 'web';
  text: string;
  sources: Source[];
  images?: string[];
}

export interface ImageSearchResult {
    type: 'image';
    keywords: string[];
    text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type SearchResult = WebSearchResult | ImageSearchResult;

export type AgentType = 'auto' | 'deep_research' | 'creative';