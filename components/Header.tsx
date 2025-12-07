import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
          <ShieldCheck className="w-8 h-8 text-indigo-400 relative z-10" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-white/90">
          Prompt<span className="text-indigo-400">Sec</span>
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Lock className="w-3 h-3 text-emerald-400" />
        <span className="text-xs font-medium text-slate-300">No Data Stored</span>
      </div>
    </header>
  );
};
