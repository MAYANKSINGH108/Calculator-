import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { DeleteIcon, HistoryIcon } from './Icons';
import { HistoryItem } from '../types';

interface CalculatorProps {
  onHistoryUpdate: (item: HistoryItem) => void;
  onToggleHistory: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onHistoryUpdate, onToggleHistory }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = useCallback((num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      // Prevent multiple dots
      if (num === '.' && display.includes('.')) return;
      // Max length check
      if (display.replace('.', '').length >= 12) return;
      setDisplay(prev => prev + num);
    }
  }, [display, shouldResetDisplay]);

  const handleOperator = useCallback((op: string) => {
    setExpression(display + ' ' + op + ' ');
    setShouldResetDisplay(true);
  }, [display]);

  const calculate = useCallback(() => {
    if (!expression && !shouldResetDisplay) return;
    
    try {
      // Safe evaluation for basic math
      const fullExpression = expression + display;
      // Sanitize input to only allow math chars
      const sanitized = fullExpression.replace(/[^0-9+\-*/.() ]/g, '');
      
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + sanitized)();
      
      if (!isFinite(result) || isNaN(result)) {
        throw new Error("Invalid calculation");
      }

      // Format result to avoid floating point errors and excessive length
      let formattedResult = String(result);
      if (formattedResult.includes('.')) {
        formattedResult = Number(result).toFixed(8).replace(/\.?0+$/, '');
      }
      
      setDisplay(formattedResult);
      setExpression('');
      setShouldResetDisplay(true);

      onHistoryUpdate({
        id: Date.now().toString(),
        expression: fullExpression,
        result: formattedResult,
        timestamp: Date.now(),
        type: 'calc'
      });

    } catch (error) {
      setDisplay('Error');
      setShouldResetDisplay(true);
      setExpression('');
    }
  }, [display, expression, onHistoryUpdate, shouldResetDisplay]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setShouldResetDisplay(false);
  }, []);

  const deleteChar = useCallback(() => {
    if (shouldResetDisplay) return;
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  }, [display, shouldResetDisplay]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleNumber('.');
      if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
      if (e.key === 'Enter') { e.preventDefault(); calculate(); }
      if (e.key === 'Backspace') deleteChar();
      if (e.key === 'Escape') clearAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, calculate, deleteChar, clearAll]);

  return (
    <div className="flex flex-col h-full w-full mx-auto max-w-sm">
      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end p-6 mb-2 rounded-3xl relative overflow-hidden group">
        
        {/* Subtle glow behind numbers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-500" />

        {/* Top Controls: History & Expression */}
        <div className="flex justify-between items-start mb-1 relative z-10">
            <button 
                onClick={onToggleHistory}
                className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                title="History"
            >
                <HistoryIcon className="w-5 h-5" />
            </button>
            <div className="text-right text-indigo-300/70 text-sm h-6 font-mono overflow-hidden whitespace-nowrap">
            {expression}
            </div>
        </div>
        
        {/* Main Result */}
        <div className="text-right relative z-10">
          <span className={`font-mono font-light tracking-tight text-white transition-all duration-200 ${display.length > 8 ? 'text-4xl sm:text-5xl' : 'text-6xl sm:text-7xl'}`}>
            {display}
          </span>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 p-2">
        <Button label="AC" onClick={clearAll} variant="danger" />
        <Button label={<DeleteIcon className="w-6 h-6" />} onClick={deleteChar} variant="secondary" />
        <Button label="%" onClick={() => handleOperator('%')} variant="secondary" />
        <Button label="/" onClick={() => handleOperator('/')} variant="primary" />

        <Button label="7" onClick={() => handleNumber('7')} />
        <Button label="8" onClick={() => handleNumber('8')} />
        <Button label="9" onClick={() => handleNumber('9')} />
        <Button label="×" onClick={() => handleOperator('*')} variant="primary" />

        <Button label="4" onClick={() => handleNumber('4')} />
        <Button label="5" onClick={() => handleNumber('5')} />
        <Button label="6" onClick={() => handleNumber('6')} />
        <Button label="-" onClick={() => handleOperator('-')} variant="primary" />

        <Button label="1" onClick={() => handleNumber('1')} />
        <Button label="2" onClick={() => handleNumber('2')} />
        <Button label="3" onClick={() => handleNumber('3')} />
        <Button label="+" onClick={() => handleOperator('+')} variant="primary" />

        <Button label="0" onClick={() => handleNumber('0')} doubleWidth />
        <Button label="." onClick={() => handleNumber('.')} />
        <Button label="=" onClick={calculate} variant="accent" />
      </div>
    </div>
  );
};

export default Calculator;