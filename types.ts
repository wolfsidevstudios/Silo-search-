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

export type AgentType = 'auto' | 'deep_research' | 'creative' | 'live';

export type InputSize = 'large' | 'thin';
export type InputShape = 'rounded' | 'pill';
export type InputTheme = 'white' | 'transparent' | 'black' | 'lightGrey';

export interface CustomizationSettings {
  backgroundUrl: string;
  inputSize: InputSize;
  inputShape: InputShape;
  inputTheme: InputTheme;
  language: string;
  // FIX: Added chatBackgroundUrl to fix type errors in ChatCustomizePanel.tsx
  chatBackgroundUrl?: string;
}
