import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`${sizeMap[size]} animate-spin text-brand-600`} />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export const TutorCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-slate-100 rounded-full w-20" />
        <div className="h-6 bg-slate-100 rounded-full w-24" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-9 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
  );
};
