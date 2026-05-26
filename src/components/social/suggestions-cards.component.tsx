'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  hashtags: string;
  visualPrompt: string;
}

interface SuggestionsCardsProps {
  suggestions: Suggestion[];
}

export function SuggestionsCards({ suggestions }: SuggestionsCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (suggestion: Suggestion) => {
    const textToCopy = `${suggestion.title}\n\n${suggestion.body}\n\n${suggestion.hashtags}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(suggestion.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
        No suggestions available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {suggestions.map((suggestion) => (
        <div 
          key={suggestion.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          data-testid={`suggestion-card-${suggestion.id}`}
        >
          {/* Visual Prompt Section */}
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
              Visual Prompt Suggestion
            </h4>
            <p className="text-sm text-blue-900" data-testid="visual-prompt">
              {suggestion.visualPrompt}
            </p>
          </div>

          {/* Copy Content Section */}
          <div className="p-5 relative">
            <button
              onClick={() => handleCopy(suggestion)}
              className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy post text"
              data-testid={`copy-btn-${suggestion.id}`}
            >
              {copiedId === suggestion.id ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <div className="pr-12">
              <h3 className="text-lg font-bold text-gray-900 mb-3" data-testid="suggestion-title">
                {suggestion.title}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap mb-4" data-testid="suggestion-body">
                {suggestion.body}
              </p>
              <p className="text-blue-600 font-medium" data-testid="suggestion-hashtags">
                {suggestion.hashtags}
              </p>
            </div>
            
            {copiedId === suggestion.id && (
              <div className="mt-4 p-2 bg-green-50 text-green-700 text-sm rounded-md flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Check className="w-4 h-4 mr-2" /> Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
