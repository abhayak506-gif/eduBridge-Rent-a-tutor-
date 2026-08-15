import React from 'react';
import { SearchX, BookOpen, CalendarX, UserX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: 'search' | 'booking' | 'tutor' | 'calendar';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'booking':
        return <CalendarX className="w-12 h-12 text-slate-400" />;
      case 'tutor':
        return <UserX className="w-12 h-12 text-slate-400" />;
      case 'search':
      default:
        return <SearchX className="w-12 h-12 text-slate-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 ${className}`}
    >
      <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
