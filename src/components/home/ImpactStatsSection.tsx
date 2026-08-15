import React from 'react';
import { IMPACT_STATS } from '@/data/mockData';
import { GraduationCap, Award, MapPin, Zap, Star, ShieldCheck } from 'lucide-react';

export const ImpactStatsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-brand-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-400" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />;
      case 'Star':
        return <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glowing gradient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Impact Across India
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Democratizing Quality Education for Every Indian Student
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real impact metrics from our pan-India network of students, parents, and educators.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 text-center space-y-2 hover:border-brand-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(stat.icon)}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-slate-400 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
