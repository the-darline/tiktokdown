
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryProps {
  items: HistoryItem[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Downloads
        </h2>
        <button 
          onClick={onClear}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <button
            key={item.id + item.timestamp}
            onClick={() => onSelect(item.url)}
            className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-800 border border-slate-700/50 hover:border-[#00f2ea]/50 transition-all text-left"
          >
            <img 
              src={item.cover} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <p className="text-[10px] text-slate-300 font-medium truncate mb-1">@{item.author}</p>
              <p className="text-xs text-white font-bold truncate">{item.title || 'Untitled'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;
