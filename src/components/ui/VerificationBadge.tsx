import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { VerificationType } from '@/types';

interface VerificationBadgeProps {
  type?: VerificationType;
  size?: 'sm' | 'md';
  showText?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type = 'Government ID & Degree',
  size = 'sm',
  showText = true,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'Top Tier Institute':
        return <Award className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
      case 'Background Verified':
        return <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
      case 'Government ID & Degree':
      default:
        return <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'Top Tier Institute':
        return 'Top IIT/BITS Alum';
      case 'Background Verified':
        return 'Background Verified';
      case 'Government ID & Degree':
      default:
        return 'Verified Educator';
    }
  };

  return (
    <span
      title={`EduBridge Trust Badge: ${type} Verified`}
      className={`inline-flex items-center gap-1 font-medium rounded-full ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px]'
          : 'px-2.5 py-1 text-xs'
      } bg-academic-50 text-academic-700 border border-academic-200/80`}
    >
      {getIcon()}
      {showText && <span>{getLabel()}</span>}
    </span>
  );
};
