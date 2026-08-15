import React, { useState } from 'react';
import { Sparkles, CheckCircle, Info } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  reasons?: string[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  reasons = [],
  size = 'md',
  showDetails = false,
}) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const getScoreColor = () => {
    if (score >= 90) return 'bg-amber-50 text-amber-800 border-amber-300';
    if (score >= 80) return 'bg-brand-50 text-brand-800 border-brand-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3.5 py-1.5 font-bold';
      case 'md':
      default:
        return 'text-xs px-2.5 py-1 font-semibold';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={() => reasons.length > 0 && setOpenTooltip(!openTooltip)}
        className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm cursor-pointer transition-all hover:scale-105 ${getScoreColor()} ${getBadgeSize()}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span>{score}% Match</span>
        {reasons.length > 0 && <Info className="w-3 h-3 text-slate-400 opacity-80" />}
      </div>

      {(showDetails || openTooltip) && reasons.length > 0 && (
        <div className="absolute z-20 bottom-full mb-2 left-0 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between font-semibold text-amber-300 pb-1 border-b border-slate-800">
            <span>Why this match?</span>
            <span className="text-[10px] text-slate-400">AI Match Engine</span>
          </div>
          <ul className="space-y-1 pt-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
