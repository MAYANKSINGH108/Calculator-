import React from 'react';
import { HistoryItem } from '../types';
import { SparklesIcon, CalculatorIcon, DeleteIcon } from './Icons';
import { HistoryIcon } from './Icons'; // Ensure HistoryIcon is imported for empty state

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden rounded-[2.5rem]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative w-4/5 max-w-sm bg-[#121215]/95 h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-white/10 ml-auto backdrop-blur-xl">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white tracking-wide">History</h2>
          <button 
            onClick={onClear}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
          >
            <DeleteIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-3">
              <div className="p-4 rounded-full bg-white/5">
                <HistoryIcon className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm font-light">No history yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="group p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                     {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   {item.type === 'ai' ? (
                     <div className="flex items-center gap-1 text-[10px] text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-full border border-fuchsia-500/20">
                       <SparklesIcon className="w-3 h-3" /> AI
                     </div>
                   ) : (
                     <div className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                       <CalculatorIcon className="w-3 h-3" /> Calc
                     </div>
                   )}
                </div>
                <div className="text-sm text-gray-400 mb-1 truncate font-mono">{item.expression}</div>
                <div className="text-xl font-light text-white text-right font-mono">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;