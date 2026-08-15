import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  badge?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
  badge,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-brand-50 rounded-xl text-brand-600 border border-brand-100">
          {icon}
        </div>
        {badge && (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {badge}
          </span>
        )}
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-xs font-medium text-slate-500 mt-0.5">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-slate-400 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
};
