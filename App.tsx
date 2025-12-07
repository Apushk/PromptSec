import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ResultsPanel } from './components/ResultsPanel';
import { analyzePrompt } from './services/analysisService';
import { AnalysisResponse } from './types';
import { Activity, Github } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzePrompt(prompt);
      setResults(data);
    } catch (err) {
      setError("Failed to analyze prompt. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex flex-col items-center pt-16 pb-20">
          
          {/* Hero Section */}
          <div className="text-center mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Test your prompts for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                Security Threats
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
              Detect injection attacks, harmful intent, and PII leaks instantly. 
              Secure your LLM workflows before deployment.
            </p>
          </div>

          {/* Main Interaction Area */}
          <div className="w-full max-w-3xl">
            <PromptInput 
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {results && <ResultsPanel results={results} />}
            
            {!results && !isLoading && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-50 hover:opacity-100 transition-opacity duration-500">
                <div className="p-4">
                  <div className="mx-auto w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-300">Real-time Analysis</h3>
                  <p className="text-xs text-slate-500 mt-1">Instant feedback on prompt safety</p>
                </div>
                <div className="p-4">
                  <div className="mx-auto w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-5 h-5 text-indigo-400" /> {/* Reuse ShieldAlert locally */}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-300">Injection Defense</h3>
                  <p className="text-xs text-slate-500 mt-1">Identifies jailbreak patterns</p>
                </div>
                <div className="p-4">
                  <div className="mx-auto w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-300">PII Masking</h3>
                  <p className="text-xs text-slate-500 mt-1">Auto-redacts sensitive data</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="w-full py-8 border-t border-white/5 flex justify-between items-center text-xs text-slate-600">
          <p>© 2024 PromptSec. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>
        </footer>
      </div>

      {/* Global CSS for custom animations that Tailwind utility classes might miss */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .cursor-wait {
          cursor: wait;
        }
      `}</style>
    </div>
  );
};

// Helper for the icon in the empty state
function ShieldAlert({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    )
}

export default App;
