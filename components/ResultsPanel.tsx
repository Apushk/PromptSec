import React from 'react';
import { AnalysisResponse } from '../types';
import { ResultCard } from './ResultCard';
import { ShieldAlert, UserX, Skull, Copy, Check } from 'lucide-react';

interface ResultsPanelProps {
  results: AnalysisResponse;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.piiDetection.maskedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-12 space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <h2 className="text-xl font-display font-bold text-white">Security Analysis</h2>
        <span className="text-xs font-mono text-slate-500">
          Scanned at {new Date(results.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResultCard
          title="Prompt Injection"
          detected={results.promptInjection.detected}
          severity={results.promptInjection.detected ? 'high' : 'safe'}
          description={results.promptInjection.description}
          icon={ShieldAlert}
          delay={1}
        />
        <ResultCard
          title="Harmful Intent"
          detected={results.harmfulIntent.detected}
          severity={results.harmfulIntent.severity}
          description={results.harmfulIntent.description}
          icon={Skull}
          delay={2}
        />
        <ResultCard
          title="PII Detection"
          detected={results.piiDetection.found}
          severity={results.piiDetection.found ? 'medium' : 'safe'}
          description={
            results.piiDetection.found 
              ? `Found potential PII: ${results.piiDetection.types.join(', ')}`
              : "No Personally Identifiable Information detected."
          }
          icon={UserX}
          delay={3}
        />
      </div>

      {/* Masked Output Section */}
      <div 
        className="mt-6 rounded-xl border border-white/10 bg-black/20 overflow-hidden opacity-0 animate-[fadeInUp_0.5s_ease-out_0.4s_forwards]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Sanitized Output</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Clean Prompt'}
          </button>
        </div>
        <div className="p-4 bg-[#0a0a0f]">
          <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap break-words">
            {results.piiDetection.maskedPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
};
