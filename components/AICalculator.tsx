import React, { useState, useRef, useEffect } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './Icons';
import { HistoryItem } from '../types';

interface AICalculatorProps {
  onHistoryUpdate: (item: HistoryItem) => void;
}

const AICalculator: React.FC<AICalculatorProps> = ({ onHistoryUpdate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; explanation: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const response = await solveMathProblem(input);
    
    setResult(response);
    setLoading(false);

    if (response.answer !== "Error") {
      onHistoryUpdate({
        id: Date.now().toString(),
        expression: input,
        result: response.answer,
        timestamp: Date.now(),
        type: 'ai'
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-scroll to result
  useEffect(() => {
    if (result && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="flex flex-col h-full w-full mx-auto max-w-md p-2 relative">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4 p-2">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-medium text-white tracking-wide">Gemini Math AI</h2>
      </div>

      {/* Main Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 space-y-6 pb-24 scrollbar-hide px-2">
        
        {/* Empty State */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center mt-8 animate-fade-in">
             <div className="w-20 h-20 bg-gradient-to-tr from-white/5 to-white/10 rounded-full flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md shadow-xl">
               <SparklesIcon className="w-10 h-10 text-indigo-400" />
             </div>
             <p className="text-xl font-medium text-white mb-2">How can I help?</p>
             <p className="text-sm text-gray-400 max-w-[200px]">I can solve complex word problems and explain the math.</p>
             
             <div className="mt-8 grid gap-2 w-full max-w-xs">
                {["Calculate 15% of 850", "Solve 3x + 10 = 25", "Square root of 1024"].map((suggestion, i) => (
                    <button 
                        key={i}
                        onClick={() => setInput(suggestion)}
                        className="text-xs text-indigo-300 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/20 py-2 px-3 rounded-full transition-colors"
                    >
                        "{suggestion}"
                    </button>
                ))}
             </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
           <div className="animate-pulse flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
             <div className="h-4 bg-white/10 rounded w-3/4"></div>
             <div className="h-4 bg-white/10 rounded w-1/2"></div>
             <div className="h-24 bg-white/5 rounded w-full mt-2"></div>
           </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 animate-slide-up">
            {/* Decorative gradient blob behind card content */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Answer</span>
              <div className="text-3xl font-light text-white mt-2 font-mono break-words leading-tight">{result.answer}</div>
            </div>
            
            <div className="relative z-10 pt-5 border-t border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Explanation</span>
              <div className="mt-3 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                {result.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
        <div className="relative shadow-xl shadow-black/50 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 focus-within:bg-white/15 focus-within:border-indigo-500/50 transition-all duration-300 group">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your math problem..."
            className="w-full bg-transparent border-none p-4 pr-14 text-white placeholder-gray-500 focus:ring-0 resize-none h-16 max-h-32 text-lg font-light"
            style={{ minHeight: '64px' }}
          />
          <button 
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICalculator;