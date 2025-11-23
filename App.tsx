import React, { useState } from 'react';
import Calculator from './components/Calculator';
import AICalculator from './components/AICalculator';
import HistoryPanel from './components/HistoryPanel';
import { CalculatorIcon, SparklesIcon } from './components/Icons';
import { CalculatorMode, HistoryItem } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[#09090b] -z-20" /> {/* Solid base */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-blob" />
      <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000" />
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none animate-blob animation-delay-4000" />

      {/* Main Glass Container */}
      <div className="w-full max-w-4xl glass-panel rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[750px] relative z-10 transition-all duration-500">
        
        {/* Navigation Sidebar */}
        <div className="md:w-24 bg-white/[0.02] flex md:flex-col justify-center md:justify-start items-center p-3 gap-6 md:pt-10 border-b md:border-b-0 md:border-r border-white/5 order-last md:order-first backdrop-blur-sm">
           <button 
             onClick={() => setMode(CalculatorMode.STANDARD)}
             className={`p-4 rounded-2xl transition-all duration-300 group relative ${mode === CalculatorMode.STANDARD ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
             title="Standard Calculator"
           >
             <CalculatorIcon className="w-7 h-7 relative z-10" />
             {mode === CalculatorMode.STANDARD && <div className="absolute inset-0 rounded-2xl border border-indigo-500/50" />}
           </button>
           
           <button 
             onClick={() => setMode(CalculatorMode.AI)}
             className={`p-4 rounded-2xl transition-all duration-300 group relative ${mode === CalculatorMode.AI ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
             title="Gemini AI Solver"
           >
             <SparklesIcon className="w-7 h-7 relative z-10" />
             {mode === CalculatorMode.AI && <div className="absolute inset-0 rounded-2xl border border-fuchsia-500/50" />}
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-gradient-to-b from-transparent to-black/20">
            <div className="flex-1 overflow-hidden relative">
                {mode === CalculatorMode.STANDARD ? (
                    <div className="h-full p-4 sm:p-8 animate-fade-in flex items-center justify-center">
                        <Calculator 
                            onHistoryUpdate={addToHistory} 
                            onToggleHistory={() => setIsHistoryOpen(true)}
                        />
                    </div>
                ) : (
                    <div className="h-full animate-fade-in">
                        <AICalculator onHistoryUpdate={addToHistory} />
                    </div>
                )}
            </div>
        </div>

        {/* History Panel (Overlay) */}
        <HistoryPanel 
            isOpen={isHistoryOpen} 
            onClose={() => setIsHistoryOpen(false)} 
            history={history}
            onClear={clearHistory}
        />

      </div>

      <div className="mt-8 text-center flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-400 font-light tracking-widest uppercase">Powered by</span>
        <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Gemini 2.5</span>
      </div>
    </div>
  );
};

export default App;