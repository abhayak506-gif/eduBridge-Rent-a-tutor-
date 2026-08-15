import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showValue = true,
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.4 && value % 1 <= 0.8;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                className={`${iconSizes[size]} fill-amber-400 text-amber-500`}
              />
            );
          }
          if (i === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={i}
                className={`${iconSizes[size]} fill-amber-400 text-amber-500`}
              />
            );
          }
          return (
            <Star
              key={i}
              className={`${iconSizes[size]} text-slate-200 fill-slate-100`}
            />
          );
        })}
      </div>

      {showValue && (
        <span className={`font-semibold text-slate-800 ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className={`text-slate-500 ${textSizes[size]}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
