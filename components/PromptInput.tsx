import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUp, Zap } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && value.trim()) {
        onSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onSubmit]);

  return (
    <div className="w-full relative group">
      {/* Glow Effect behind input */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur transition duration-500 opacity-0 ${isFocused ? 'opacity-30' : 'group-hover:opacity-10'}`}
      ></div>
      
      <div 
        className={`relative bg-[#16161d] rounded-2xl border transition-all duration-300 flex flex-col ${isFocused ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'border-white/10'}`}
      >
        <div className="p-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste your prompt here to scan for vulnerabilities..."
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none font-mono text-sm leading-relaxed min-h-[120px]"
            spellCheck={false}
          />
        </div>

        <div className="px-4 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="w-3 h-3" />
            <span>AI Security Scan</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 font-mono">
              {value.length} chars
            </span>
            <button
              onClick={onSubmit}
              disabled={isLoading || !value.trim()}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${!value.trim() 
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                  : isLoading
                    ? 'bg-indigo-600/50 text-white cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowUp className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Keyboard hint */}
      <div className={`absolute -bottom-6 right-0 text-[10px] text-slate-600 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
        Press Ctrl + Enter to analyze
      </div>
    </div>
  );
};
