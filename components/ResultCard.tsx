import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, LucideIcon } from 'lucide-react';

interface ResultCardProps {
  title: string;
  detected: boolean;
  severity?: 'low' | 'medium' | 'high' | 'safe';
  description: string;
  icon: LucideIcon;
  delay?: number; // Animation delay index
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  detected, 
  severity, 
  description, 
  icon: Icon,
  delay = 0 
}) => {
  
  // Determine visual state based on detection and severity
  let statusColor = 'text-emerald-400';
  let bgColor = 'bg-emerald-400/5';
  let borderColor = 'border-emerald-400/20';
  let StatusIcon = CheckCircle2;

  if (detected) {
    if (severity === 'high') {
      statusColor = 'text-red-400';
      bgColor = 'bg-red-400/5';
      borderColor = 'border-red-400/20';
      StatusIcon = AlertOctagon;
    } else {
      statusColor = 'text-amber-400';
      bgColor = 'bg-amber-400/5';
      borderColor = 'border-amber-400/20';
      StatusIcon = AlertTriangle;
    }
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border ${borderColor} ${bgColor} p-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01]`}
      style={{
        animation: `fadeInUp 0.5s ease-out forwards ${delay * 0.1}s`,
        opacity: 0,
        transform: 'translateY(10px)'
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-black/20 ${statusColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold text-sm">{title}</h3>
            <span className={`text-xs font-mono uppercase tracking-wider ${statusColor}`}>
              {detected ? (severity ? `${severity} Risk` : 'Detected') : 'Safe'}
            </span>
          </div>
        </div>
        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
      </div>
      
      <p className="text-sm text-slate-400 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
